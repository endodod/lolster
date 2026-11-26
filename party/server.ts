import { routePartykitRequest, Server, type Connection } from "partyserver";
import { drawWord, guessOptions, imposterIntel, shuffle } from "../src/shared/words";
import {
  CLUE_MAX,
  CLUE_ROUND_CHOICES,
  CLUE_SECONDS_CHOICES,
  DEFAULT_SETTINGS,
  DISCUSS_CHOICES,
  INF,
  POLL_SECONDS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  NAME_MAX,
  SKIP,
  maxImposters,
  type ClientMsg,
  type Clue,
  type Phase,
  type ResultInfo,
  type RoomState,
  type ServerMsg,
  type Settings,
} from "../src/shared/types";
import { isGame, POOL_NAMES, poolNames } from "../src/shared/words";

type Player = {
  id: string;
  name: string;
  connected: boolean;
  score: number;
  joinedAt: number;
  leftAt?: number;
};

type Round = {
  word: string;
  cat: string;
  imposters: string[];
  order: string[];
  ready: Set<string>;
  clues: Clue[];
  turnIdx: number;
  votes: Map<string, string>;
  /** Between-rounds poll answers (endless clue rounds): true = vote now. */
  poll: Map<string, boolean>;
  accused?: string;
  options?: string[];
  result?: ResultInfo;
  /** Per-imposter intel, fixed at round start. */
  intel: Map<string, { cat?: string; sub?: string; bonus: boolean }>;
};

const GUESS_SECONDS = 30;
/** Players who drop out of the lobby are removed after this long. */
const LOBBY_GRACE_MS = 45_000;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** One lobby = one Durable Object, addressed by its 4-letter code. State lives only in memory. */
export class LolsterRoom extends Server {
  players = new Map<string, Player>();
  hostId = "";
  phase: Phase = "lobby";
  roundNo = 0;
  settings: Settings = { ...DEFAULT_SETTINGS, cats: [...POOL_NAMES] };
  round: Round | null = null;
  recent: string[] = [];
  endsAt: number | undefined;
  timer: ReturnType<typeof setTimeout> | undefined;
  starter: string | undefined;

  // ---------- connection lifecycle ----------

  onConnect(conn: Connection) {
    // Players identify by a stable id kept in their browser, so a refresh rejoins the same seat.
    const p = this.players.get(conn.id);
    if (p) {
      p.connected = true;
      p.leftAt = undefined;
      if (!this.connected(this.hostId)) this.hostId = p.id;
      this.broadcast();
    } else {
      this.sendTo(conn, this.stateFor(conn.id));
    }
  }

  onClose(conn: Connection) {
    const p = this.players.get(conn.id);
    if (!p) return;
    // Another tab of the same player may still be open.
    for (const c of this.getConnections()) if (c.id === conn.id && c !== conn) return;
    p.connected = false;
    p.leftAt = Date.now();
    if (this.hostId === p.id) this.passHost();
    if (this.phase === "lobby") {
      setTimeout(() => {
        const q = this.players.get(p.id);
        if (q && !q.connected && this.phase === "lobby") {
          this.players.delete(p.id);
          this.broadcast();
        }
      }, LOBBY_GRACE_MS);
    }
    this.progress();
    this.broadcast();
  }

  onMessage(sender: Connection, raw: string | ArrayBuffer | ArrayBufferView) {
    if (typeof raw !== "string") return;
    let msg: ClientMsg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }
    const id = sender.id;
    const isHost = id === this.hostId;
    const r = this.round;

    switch (msg.t) {
      case "join": {
        const name = this.uniqueName(String(msg.name ?? ""), id);
        const existing = this.players.get(id);
        if (existing) {
          existing.name = name;
          existing.connected = true;
        } else {
          if (this.players.size >= MAX_PLAYERS) return this.error(sender, "This lobby is full.");
          this.players.set(id, { id, name, connected: true, score: 0, joinedAt: Date.now() });
        }
        if (!this.connected(this.hostId)) this.hostId = id;
        break;
      }
      case "rename": {
        const p = this.players.get(id);
        if (p) p.name = this.uniqueName(String(msg.name ?? ""), id);
        break;
      }
      case "leave": {
        this.removePlayer(id);
        sender.close();
        break;
      }
      case "settings": {
        if (!isHost || this.phase !== "lobby") return;
        this.applySettings(msg.settings ?? {});
        break;
      }
      case "start":
      case "next": {
        if (!isHost) return;
        if (msg.t === "start" && this.phase !== "lobby") return;
        if (msg.t === "next" && this.phase !== "result") return;
        const err = this.startRound();
        if (err) return this.error(sender, err);
        break;
      }
      case "lobby": {
        if (!isHost) return;
        this.toLobby();
        break;
      }
      case "ready": {
        if (this.phase !== "reveal" || !r || !r.order.includes(id)) return;
        r.ready.add(id);
        break;
      }
      case "clue": {
        if (this.phase !== "clues" || !r || this.currentTurn() !== id) return;
        const text = String(msg.text ?? "").trim().replace(/\s+/g, " ").slice(0, CLUE_MAX);
        if (!text) return;
        if (!r.imposters.includes(id) && norm(text).includes(norm(r.word)))
          return this.error(sender, "Your clue can't contain the word itself.");
        r.clues.push({ pid: id, text });
        this.advanceTurn();
        break;
      }
      case "openVote": {
        if (!isHost || (this.phase !== "discuss" && this.phase !== "clues" && this.phase !== "poll")) return;
        if (this.phase === "discuss") this.openVote();
        // Ending the clue phase early still honours a configured discussion.
        else this.endClues();
        break;
      }
      case "poll": {
        if (this.phase !== "poll" || !r || !r.order.includes(id)) return;
        r.poll.set(id, !!msg.now);
        break;
      }
      case "vote": {
        if (this.phase !== "vote" || !r || !r.order.includes(id)) return;
        const target = String(msg.target);
        if (target !== SKIP && (!r.order.includes(target) || target === id)) return;
        r.votes.set(id, target);
        break;
      }
      case "endVote": {
        if (!isHost || this.phase !== "vote") return;
        this.tally();
        break;
      }
      case "guess": {
        if (this.phase !== "guess" || !r || r.accused !== id) return;
        const word = String(msg.word);
        if (!r.options?.includes(word)) return;
        this.finishGuess(word);
        break;
      }
      case "kick": {
        if (!isHost || msg.id === id) return;
        const target = String(msg.id);
        for (const c of this.getConnections()) {
          if (c.id === target) {
            this.sendTo(c, { t: "kicked" });
            c.close();
          }
        }
        this.removePlayer(target);
        break;
      }
      case "host": {
        if (!isHost || !this.connected(msg.id)) return;
        this.hostId = msg.id;
        break;
      }
      default:
        return;
    }
    this.progress();
    this.broadcast();
  }

  // ---------- game flow ----------

  startRound(): string | null {
    const ids = [...this.players.values()].filter((p) => p.connected).map((p) => p.id);
    if (ids.length < MIN_PLAYERS) return `You need at least ${MIN_PLAYERS} connected players.`;
    const { cat, word } = drawWord(this.settings.cats, this.recent, this.settings.game);
    this.recent = [word, ...this.recent].slice(0, 40);
    const count = Math.min(this.settings.imposters, maxImposters(ids.length));
    // Fully random order; an imposter who speaks first is compensated with extra intel.
    const order = shuffle(ids);
    const imposters = shuffle(ids).slice(0, count);
    const intel = new Map(
      imposters.map((pid) => [pid, imposterIntel(cat, word, this.settings.hint, pid === order[0])]),
    );
    this.round = {
      word,
      cat,
      imposters,
      order,
      ready: new Set(),
      clues: [],
      turnIdx: 0,
      votes: new Map(),
      poll: new Map(),
      intel,
    };
    this.starter = order[0];
    this.roundNo++;
    this.setPhase("reveal");
    return null;
  }

  toLobby() {
    this.clearTimer();
    this.round = null;
    this.starter = undefined;
    this.setPhase("lobby");
    // Drop anyone who left during the game.
    for (const p of [...this.players.values()]) if (!p.connected) this.players.delete(p.id);
  }

  /** Called after every change: moves the game forward when everyone has acted. */
  progress() {
    const r = this.round;
    if (!r) return;
    const active = r.order.filter((pid) => this.connected(pid));
    if (this.phase === "reveal" && active.every((pid) => r.ready.has(pid))) {
      if (this.settings.clueRounds !== 0) {
        r.turnIdx = 0;
        this.setPhase("clues");
        this.skipAbsentTurns();
        this.armClueTimer();
      } else {
        this.setPhase("discuss");
        this.armDiscussTimer();
      }
    } else if (this.phase === "clues") {
      // The player whose turn it was may have disconnected.
      const before = r.turnIdx;
      this.skipAbsentTurns();
      if (r.turnIdx !== before && this.phase === "clues") this.armClueTimer();
    } else if (this.phase === "poll" && active.length && active.every((pid) => r.poll.has(pid))) {
      this.resolvePoll();
    } else if (this.phase === "vote" && active.length && active.every((pid) => r.votes.has(pid))) {
      this.tally();
    }
  }

  currentTurn(): string | undefined {
    const r = this.round;
    if (!r || this.phase !== "clues") return;
    return r.order[r.turnIdx % r.order.length];
  }

  totalTurns() {
    if (this.settings.clueRounds === INF) return Infinity;
    return (this.round?.order.length ?? 0) * this.settings.clueRounds;
  }

  advanceTurn() {
    const r = this.round!;
    const n = r.order.length;
    const before = Math.floor(r.turnIdx / n);
    r.turnIdx++;
    this.skipAbsentTurns();
    if (this.phase !== "clues") return;
    // Endless rounds: after every full round, ask the table whether to vote now.
    if (this.settings.clueRounds === INF && Math.floor(r.turnIdx / n) > before) this.startPoll();
    else this.armClueTimer();
  }

  startPoll() {
    const r = this.round!;
    r.poll.clear();
    this.setPhase("poll");
    this.schedule(POLL_SECONDS, () => this.resolvePoll());
  }

  /** Strict majority of answers for "vote now" ends the clues; otherwise play another round. */
  resolvePoll() {
    const r = this.round!;
    if (this.phase !== "poll") return;
    const answers = [...r.poll.values()];
    const now = answers.filter(Boolean).length;
    if (now > answers.length - now) return this.endClues();
    this.clearTimer();
    this.setPhase("clues");
    this.skipAbsentTurns();
    // skipAbsentTurns may have ended the clue phase (TS narrowed phase to "poll" above).
    if ((this.phase as Phase) === "clues") this.armClueTimer();
  }

  /** Leave the clue phase: to discussion if one is configured, otherwise straight to voting. */
  endClues() {
    if (this.settings.discussSeconds !== 0) {
      this.setPhase("discuss");
      this.armDiscussTimer();
    } else this.openVote();
  }

  skipAbsentTurns() {
    const r = this.round!;
    // With endless rounds, stop scanning if nobody in the round is connected.
    if (!r.order.some((pid) => this.connected(pid))) return;
    while (r.turnIdx < this.totalTurns() && !this.connected(r.order[r.turnIdx % r.order.length])) {
      r.turnIdx++;
    }
    if (r.turnIdx >= this.totalTurns()) this.endClues();
  }

  armClueTimer() {
    this.clearTimer();
    const s = this.settings.clueSeconds;
    if (!s) return;
    const turn = this.round!.turnIdx;
    this.schedule(s, () => {
      const r = this.round;
      if (this.phase !== "clues" || !r || r.turnIdx !== turn) return;
      r.clues.push({ pid: this.currentTurn()!, text: "…" });
      this.advanceTurn();
    });
  }

  armDiscussTimer() {
    this.clearTimer();
    if (this.settings.discussSeconds > 0) this.schedule(this.settings.discussSeconds, () => this.openVote());
  }

  openVote() {
    this.clearTimer();
    this.round!.votes.clear();
    this.setPhase("vote");
  }

  tally() {
    const r = this.round!;
    this.clearTimer();
    const counts = new Map<string, number>();
    for (const t of r.votes.values()) counts.set(t, (counts.get(t) ?? 0) + 1);
    const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const [top, second] = ranked;
    if (!top || (second && second[1] === top[1])) return this.finish({ kind: "escaped", reason: "tie" });
    if (top[0] === SKIP) return this.finish({ kind: "escaped", reason: "skip" });
    if (!r.imposters.includes(top[0])) return this.finish({ kind: "escaped", reason: "wrong", ejected: top[0] });
    r.accused = top[0];
    r.options = guessOptions(r.cat, r.word);
    this.setPhase("guess");
    this.schedule(GUESS_SECONDS, () => this.finishGuess(null));
  }

  finishGuess(word: string | null) {
    const r = this.round!;
    if (this.phase !== "guess" || !r.accused) return;
    this.finish({ kind: "caught", ejected: r.accused, guessed: word, correct: word === r.word });
  }

  finish(outcome: ResultInfo["outcome"]) {
    const r = this.round!;
    this.clearTimer();
    const gains: Record<string, number> = {};
    const crew = r.order.filter((pid) => !r.imposters.includes(pid));
    if (outcome.kind === "escaped") {
      for (const pid of r.imposters) gains[pid] = 2;
    } else if (outcome.correct) {
      for (const pid of r.imposters) gains[pid] = pid === outcome.ejected ? 2 : 1;
    } else {
      for (const pid of crew) gains[pid] = r.votes.get(pid) === outcome.ejected ? 2 : 1;
    }
    for (const [pid, g] of Object.entries(gains)) {
      const p = this.players.get(pid);
      if (p) p.score += g;
    }
    r.result = {
      word: r.word,
      cat: r.cat,
      imposters: r.imposters,
      votes: Object.fromEntries(r.votes),
      outcome,
      gains,
    };
    this.setPhase("result");
  }

  // ---------- helpers ----------

  setPhase(p: Phase) {
    this.phase = p;
    if (p !== "clues" && p !== "poll" && p !== "discuss" && p !== "guess") this.endsAt = undefined;
  }

  schedule(seconds: number, fn: () => void) {
    this.clearTimer();
    this.endsAt = Date.now() + seconds * 1000;
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.endsAt = undefined;
      fn();
      this.progress();
      this.broadcast();
    }, seconds * 1000);
  }

  clearTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
    this.endsAt = undefined;
  }

  connected(id: string | undefined) {
    return !!id && !!this.players.get(id)?.connected;
  }

  passHost() {
    const next = [...this.players.values()]
      .filter((p) => p.connected)
      .sort((a, b) => a.joinedAt - b.joinedAt)[0];
    if (next) this.hostId = next.id;
  }

  removePlayer(id: string) {
    if (!this.players.delete(id)) return;
    if (this.hostId === id) this.passHost();
    const r = this.round;
    if (r && r.order.includes(id)) {
      const remaining = r.order.filter((pid) => pid !== id);
      const imps = r.imposters.filter((pid) => pid !== id);
      if (this.phase !== "result" && (remaining.length < MIN_PLAYERS || imps.length === 0)) {
        this.toLobby();
        return;
      }
      // Keep the clue turn on the same seat in the shorter order.
      const oldLen = r.order.length;
      const clueRound = Math.floor(r.turnIdx / oldLen);
      const pos = r.turnIdx % oldLen;
      const removedPos = r.order.indexOf(id);
      r.order = remaining;
      r.imposters = imps;
      r.votes.delete(id);
      r.poll.delete(id);
      for (const [v, t] of r.votes) if (t === id) r.votes.delete(v);
      r.clues = r.clues.filter((c) => c.pid !== id);
      if (this.phase === "clues") {
        r.turnIdx = clueRound * remaining.length + (removedPos < pos ? pos - 1 : pos);
        this.skipAbsentTurns();
        if (this.phase === "clues") this.armClueTimer();
      }
    }
  }

  applySettings(s: Partial<Settings>) {
    const n = [...this.players.values()].filter((p) => p.connected).length;
    const cur = this.settings;
    const int = (v: unknown, lo: number, hi: number, d: number) => {
      const x = Math.round(Number(v));
      return Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : d;
    };
    const game = isGame(s.game) ? s.game : cur.game;
    const names = poolNames(game);
    // Switching game resets the pools to everything in the new game.
    const choice = (v: unknown, allowed: number[], d: number) =>
      v !== undefined && allowed.includes(Number(v)) ? Number(v) : d;
    let cats = game !== cur.game ? names : Array.isArray(s.cats) ? s.cats.filter((c) => names.includes(c)) : cur.cats;
    if (!cats.length) cats = cur.game === game ? cur.cats : names;
    this.settings = {
      imposters: int(s.imposters ?? cur.imposters, 1, Math.max(maxImposters(n), 1, 7), cur.imposters),
      hint: typeof s.hint === "boolean" ? s.hint : cur.hint,
      game,
      cats,
      clueRounds: choice(s.clueRounds, CLUE_ROUND_CHOICES, cur.clueRounds),
      discussSeconds: choice(s.discussSeconds, DISCUSS_CHOICES, cur.discussSeconds),
      clueSeconds: choice(s.clueSeconds, CLUE_SECONDS_CHOICES, cur.clueSeconds),
    };
  }

  uniqueName(raw: string, id: string) {
    const base = raw.replace(/\s+/g, " ").trim().slice(0, NAME_MAX) || "Summoner";
    const taken = new Set([...this.players.values()].filter((p) => p.id !== id).map((p) => p.name.toLowerCase()));
    if (!taken.has(base.toLowerCase())) return base;
    for (let i = 2; ; i++) {
      const n = `${base.slice(0, NAME_MAX - 2)} ${i}`;
      if (!taken.has(n.toLowerCase())) return n;
    }
  }

  stateFor(id: string): RoomState {
    const r = this.round;
    const inRound = (pid: string) => !!r && r.order.includes(pid);
    let you: RoomState["you"] = { id, role: "spectator" };
    if (r && inRound(id)) {
      const imp = r.imposters.includes(id);
      you = imp
        ? {
            id,
            role: "imposter",
            ...r.intel.get(id),
            partners: r.imposters.length > 1 ? r.imposters.filter((x) => x !== id) : undefined,
          }
        : { id, role: "crew", word: r.word, cat: r.cat };
      you.first = r.order[0] === id;
      you.vote = r.votes.get(id);
      you.poll = this.phase === "poll" ? r.poll.get(id) : undefined;
    }
    const players = [...this.players.values()]
      .sort((a, b) => a.joinedAt - b.joinedAt)
      .map((p) => ({
        id: p.id,
        name: p.name,
        connected: p.connected,
        score: p.score,
        inRound: inRound(p.id),
        ready: !!r?.ready.has(p.id),
        voted: !!r?.votes.has(p.id),
        polled: this.phase === "poll" && !!r?.poll.has(p.id),
      }));
    return {
      code: this.name,
      hostId: this.hostId,
      phase: this.phase,
      round: this.roundNo,
      settings: this.settings,
      players,
      order: r?.order ?? [],
      starter: this.starter,
      clues: r?.clues ?? [],
      turn: this.currentTurn(),
      clueRound:
        r && this.phase === "clues"
          ? Math.floor(r.turnIdx / r.order.length) + 1
          : r && this.phase === "poll"
            ? Math.floor(r.turnIdx / r.order.length)
            : undefined,
      pollTally:
        r && this.phase === "poll"
          ? { now: [...r.poll.values()].filter(Boolean).length, more: [...r.poll.values()].filter((v) => !v).length }
          : undefined,
      endsAt: this.endsAt,
      accused: this.phase === "guess" || this.phase === "result" ? r?.accused : undefined,
      options: this.phase === "guess" ? r?.options : undefined,
      result: this.phase === "result" ? r?.result : undefined,
      you,
    };
  }

  sendTo(conn: Connection, msg: ServerMsg | RoomState) {
    const m: ServerMsg = "t" in msg ? msg : { t: "state", state: msg, now: Date.now() };
    conn.send(JSON.stringify(m));
  }

  error(conn: Connection, message: string) {
    this.sendTo(conn, { t: "error", message });
  }

  broadcast() {
    for (const c of this.getConnections()) this.sendTo(c, this.stateFor(c.id));
  }
}

type Env = { Main: DurableObjectNamespace<LolsterRoom> };

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(req, env as unknown as Record<string, unknown>)) ??
      new Response("Lolster lobby server", { status: 404 })
    );
  },
};
