import PartySocket from "partysocket";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  CLUE_MAX,
  maxImposters,
  MIN_PLAYERS,
  SKIP,
  type ClientMsg,
  type RoomState,
  type ServerMsg,
  type Settings,
} from "./shared/types";
import { playerId, store } from "./store";
import { Card, fmtTime, Panel, Peek, Pools, Stepper, Switch, Timer, Toast, useCountdown, useCover, type CardFace } from "./ui";

const HOST = (import.meta.env.VITE_PARTYKIT_HOST as string | undefined) ?? "localhost:1999";

type Conn = "connecting" | "open" | "closed" | "kicked";

function useRoom(code: string, name: string) {
  const [state, setState] = useState<RoomState | null>(null);
  const [conn, setConn] = useState<Conn>("connecting");
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const ws = useRef<PartySocket | null>(null);
  const nameRef = useRef(name);
  nameRef.current = name;

  useEffect(() => {
    const s = new PartySocket({ host: HOST, room: code, id: playerId() });
    ws.current = s;
    s.addEventListener("open", () => {
      setConn("open");
      s.send(JSON.stringify({ t: "join", name: nameRef.current } satisfies ClientMsg));
    });
    s.addEventListener("close", () => setConn((c) => (c === "kicked" ? c : "closed")));
    s.addEventListener("message", (e: MessageEvent) => {
      const m = JSON.parse(e.data) as ServerMsg;
      if (m.t === "state") {
        setState(m.state);
        setOffset(m.now - Date.now());
      } else if (m.t === "error") setError(m.message);
      else if (m.t === "kicked") {
        setConn("kicked");
        s.close();
      }
    });
    return () => s.close();
  }, [code]);

  const send = (m: ClientMsg) => ws.current?.send(JSON.stringify(m));
  return { state, conn, error, setError, offset, send, leave: () => { send({ t: "leave" }); ws.current?.close(); } };
}

export function Online(p: { code: string; name: string; onExit: () => void }) {
  const { state, conn, error, setError, offset, send, leave } = useRoom(p.code, p.name);
  const [discreet, setDiscreet] = useState(() => store.get("lolster.discreet", true));
  const { cover, overlay } = useCover();
  const toggleDiscreet = () => {
    setDiscreet(!discreet);
    store.set("lolster.discreet", !discreet);
  };

  const exit = () => {
    leave();
    p.onExit();
  };

  const top = (
    <div class="topbar">
      <button class="brand" onClick={exit} title="Leave lobby">
        Lolster
      </button>
      <div class="tools">
        <button aria-pressed={discreet} onClick={toggleDiscreet} title="Hold-to-peek and neutral card colours, for players sitting side by side">
          Discreet
        </button>
        <button onClick={cover} title="Cover the screen (shortcut: C)">
          Cover <kbd>C</kbd>
        </button>
      </div>
    </div>
  );

  if (conn === "kicked")
    return (
      <section>
        <Panel class="center">
          <h2>Removed from lobby</h2>
          <p class="hint">The host removed you from {p.code}.</p>
        </Panel>
        <button class="big" onClick={p.onExit}>
          Home
        </button>
      </section>
    );

  if (!state || !state.players.some((x) => x.id === state.you.id))
    return (
      <section>
        {top}
        <Panel class="center">
          <p class="hint">{conn === "closed" ? "Connection lost. Reconnecting…" : `Joining ${p.code}…`}</p>
        </Panel>
        <button class="ghost" onClick={exit}>
          Cancel
        </button>
        <Toast msg={error} onDone={() => setError(null)} />
      </section>
    );

  const g = { state, send, offset, discreet };
  return (
    <section>
      {top}
      {conn !== "open" && <div class="toast">Reconnecting…</div>}
      {state.phase === "lobby" ? <Lobby {...g} onLeave={exit} /> : <Game {...g} />}
      <Toast msg={error} onDone={() => setError(null)} />
      {overlay}
    </section>
  );
}

type G = { state: RoomState; send: (m: ClientMsg) => void; offset: number; discreet: boolean };

const nameOf = (s: RoomState, id?: string) => s.players.find((x) => x.id === id)?.name ?? "Someone";

function Lobby({ state, send, onLeave }: G & { onLeave: () => void }) {
  const me = state.you.id;
  const host = state.hostId === me;
  const online = state.players.filter((x) => x.connected).length;
  const [copied, setCopied] = useState(false);
  const link = `${location.origin}/${state.code}`;
  const share = async () => {
    try {
      if (navigator.share && matchMedia("(pointer: coarse)").matches) await navigator.share({ title: "Lolster", url: link });
      else {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* cancelled */
    }
  };
  const set = (s: Partial<Settings>) => send({ t: "settings", settings: s });
  const st = state.settings;
  const ro = !host;

  return (
    <>
      <Panel class="roomcode">
        <div class="tag">Lobby code</div>
        <div class="code">{state.code}</div>
        <button onClick={share} style="width:100%">
          {copied ? "Link copied" : "Copy invite link"}
        </button>
      </Panel>

      <Panel>
        <div class="row">
          <span class="lbl">Summoners ({state.players.length})</span>
          {state.round > 0 && <small>Round {state.round} done</small>}
        </div>
        <ul class="players">
          {state.players.map((pl) => (
            <li>
              <span class={`dot${pl.connected ? "" : " off"}`} title={pl.connected ? "Online" : "Offline"} />
              <span class="nm">
                {pl.name} {pl.id === state.hostId && <span class="badge">Host</span>} {pl.id === me && <span class="badge me">You</span>}
              </span>
              {state.round > 0 && <span class="score">{pl.score}</span>}
              {host && pl.id !== me && (
                <>
                  {pl.connected && (
                    <button onClick={() => send({ t: "host", id: pl.id })} title="Make host">
                      Host
                    </button>
                  )}
                  <button class="danger" onClick={() => send({ t: "kick", id: pl.id })} aria-label={`Remove ${pl.name}`}>
                    ✕
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        {ro && <small>Only the host can change settings.</small>}
        <Stepper
          label="Imposters"
          value={st.imposters}
          min={1}
          max={Math.max(1, maxImposters(online))}
          onChange={ro ? undefined : (imposters) => set({ imposters })}
        />
        <Switch label="Imposter sees category" checked={st.hint} onChange={ro ? undefined : (hint) => set({ hint })} note="Whoever speaks first gets a bonus hint" />
        <Stepper
          label="Typed clue rounds"
          value={st.clueRounds}
          min={0}
          max={3}
          format={(v) => (v ? String(v) : "Voice")}
          onChange={ro ? undefined : (clueRounds) => set({ clueRounds })}
        />
        {st.clueRounds > 0 && (
          <Stepper
            label="Time per clue"
            value={st.clueSeconds}
            min={0}
            max={90}
            step={15}
            format={fmtTime}
            onChange={ro ? undefined : (clueSeconds) => set({ clueSeconds })}
          />
        )}
        <Stepper
          label={st.clueRounds > 0 ? "Discussion after clues" : "Discussion timer"}
          value={st.discussSeconds}
          min={0}
          max={300}
          step={30}
          format={(v) => (v ? fmtTime(v) : st.clueRounds > 0 ? "Skip" : "Host")}
          onChange={ro ? undefined : (discussSeconds) => set({ discussSeconds })}
        />
        <small>{st.clueRounds > 0 ? "Clues are typed in turn, then everyone votes." : "Say your clues out loud (same room or voice call), then vote here."}</small>
      </Panel>
      <Pools value={st.cats} onChange={ro ? undefined : (cats) => set({ cats })} />

      {host ? (
        <button class="big" disabled={online < MIN_PLAYERS} onClick={() => send({ t: "start" })}>
          {online < MIN_PLAYERS ? `Need ${MIN_PLAYERS - online} more` : state.round ? "Start next round" : "Start game"}
        </button>
      ) : (
        <Panel class="center">
          <p class="hint" style="margin:0">Waiting for {nameOf(state, state.hostId)} to start…</p>
        </Panel>
      )}
      <button class="ghost" onClick={onLeave}>
        Leave lobby
      </button>
    </>
  );
}

function myFace(s: RoomState): CardFace | null {
  const y = s.you;
  if (y.role === "crew") return { kind: "crew", word: y.word!, cat: y.cat! };
  if (y.role === "imposter") return { kind: "imposter", cat: y.cat, partners: y.partners?.map((id) => nameOf(s, id)), sub: y.sub, first: y.first };
  return null;
}

function Secret({ state, discreet }: G) {
  const y = state.you;
  if (y.role === "spectator") return null;
  const secret =
    y.role === "crew"
      ? `${y.word} · ${y.cat}`
      : `Imposter${y.cat ? ` · ${y.cat}` : ""}${y.sub ? ` › ${y.sub}` : ""}`;
  return <Peek label="your card" secret={secret} discreet={discreet} />;
}

function Game(g: G) {
  const { state } = g;
  const left = useCountdown(state.endsAt, g.offset);
  const spectating = state.you.role === "spectator" && state.phase !== "result";

  return (
    <>
      <div class="prog">
        Round {state.round}
        {state.clueRound && ` · Clue round ${state.clueRound} of ${state.settings.clueRounds}`}
      </div>
      {spectating && (
        <Panel class="center">
          <p class="hint" style="margin:0">You joined mid-round. You're in from the next one.</p>
        </Panel>
      )}
      {state.phase === "reveal" && <Reveal {...g} />}
      {state.phase === "clues" && <Clues {...g} left={left} />}
      {state.phase === "discuss" && <Discuss {...g} left={left} />}
      {state.phase === "vote" && <Vote {...g} />}
      {state.phase === "guess" && <Guess {...g} left={left} />}
      {state.phase === "result" && <Result {...g} />}
      <Scores state={state} />
    </>
  );
}

function Reveal(g: G) {
  const { state, send, discreet } = g;
  const [flipped, setFlipped] = useState(false);
  const [looked, setLooked] = useState(false);
  const face = myFace(state);
  const me = state.players.find((x) => x.id === state.you.id)!;
  const inRound = state.players.filter((x) => x.inRound);
  const ready = inRound.filter((x) => x.ready).length;
  if (!face) return <Waiting state={state} text={`${ready} of ${inRound.length} have seen their card`} />;
  return (
    <>
      <Card
        who={me.name}
        face={face}
        flipped={flipped}
        discreet={discreet}
        onFlip={(v) => {
          setFlipped(v);
          if (v) setLooked(true);
        }}
      />
      {state.you.first && face.kind === "crew" && <p class="hint center">You'll give the first clue.</p>}
      <button class="big" disabled={!looked || me.ready} onClick={() => { setFlipped(false); send({ t: "ready" }); }}>
        {me.ready ? `Waiting… ${ready}/${inRound.length} ready` : looked ? "Got it" : discreet ? "Hold the card to look" : "Tap the card to look"}
      </button>
    </>
  );
}

function Waiting({ state, text }: { state: RoomState; text: string }) {
  return (
    <Panel class="center">
      <p class="hint" style="margin:0">{text}</p>
      <ul class="list">
        {state.players.filter((x) => x.inRound && !x.ready).map((x) => <li style="border-color:var(--line);color:var(--mute)">{x.name}</li>)}
      </ul>
    </Panel>
  );
}

function ClueList({ state }: { state: RoomState }) {
  const rounds = state.settings.clueRounds || 1;
  const n = state.order.length;
  if (!state.clues.length && state.phase !== "clues") return null;
  const grouped = Array.from({ length: rounds }, (_, i) => state.clues.slice(i * n, (i + 1) * n));
  return (
    <Panel>
      {grouped.map((cl, i) =>
        cl.length || (state.phase === "clues" && state.clueRound === i + 1) ? (
          <>
            {rounds > 1 && <div class="rhead">Round {i + 1}</div>}
            <ul class="clues">
              {cl.map((c) => (
                <li>
                  <span class="by">{nameOf(state, c.pid)}</span>
                  <span class="tx">{c.text}</span>
                </li>
              ))}
              {state.phase === "clues" && state.clueRound === i + 1 && state.turn && (
                <li class="now pending">
                  <span class="by">{nameOf(state, state.turn)}</span>
                  <span class="tx">thinking…</span>
                </li>
              )}
            </ul>
          </>
        ) : null,
      )}
    </Panel>
  );
}

function Clues(g: G & { left: number | null }) {
  const { state, send } = g;
  const mine = state.turn === state.you.id;
  const [text, setText] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (mine) input.current?.focus();
    setText("");
  }, [mine, state.clues.length]);
  const host = state.hostId === state.you.id;
  return (
    <>
      <Secret {...g} />
      <Panel class="center">
        {mine ? <h2 style="margin:0">Your turn</h2> : <div class="hint" style="margin:0">{nameOf(state, state.turn)} is giving a clue</div>}
        <Timer left={g.left} />
        {mine && (
          <form
            class="split"
            style="margin-top:10px"
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) send({ t: "clue", text });
            }}
          >
            <input
              ref={input}
              class="text"
              value={text}
              maxLength={CLUE_MAX}
              placeholder="One word or short clue"
              aria-label="Your clue"
              autocomplete="off"
              onInput={(e) => setText((e.target as HTMLInputElement).value)}
            />
            <button type="submit" disabled={!text.trim()}>
              Send
            </button>
          </form>
        )}
      </Panel>
      <ClueList state={state} />
      {host && (
        <button class="ghost" onClick={() => send({ t: "openVote" })}>
          Skip to voting
        </button>
      )}
    </>
  );
}

function Discuss(g: G & { left: number | null }) {
  const { state, send } = g;
  const host = state.hostId === state.you.id;
  const voice = state.settings.clueRounds === 0;
  return (
    <>
      <Secret {...g} />
      <Panel class="center">
        {voice ? (
          <>
            <div class="hint">Speaking order</div>
            <div class="who" style="margin:8px 0">{nameOf(state, state.starter)} starts</div>
            <div class="hint">{state.order.map((id) => nameOf(state, id)).join(" → ")}</div>
          </>
        ) : (
          <div class="who">Discuss</div>
        )}
        <Timer left={g.left} done="Vote!" />
        {!host && !g.left && <p class="hint">The host opens voting when you're ready.</p>}
      </Panel>
      <ClueList state={state} />
      {host && (
        <button class="big" onClick={() => send({ t: "openVote" })}>
          Open voting
        </button>
      )}
    </>
  );
}

function Vote(g: G) {
  const { state, send } = g;
  const me = state.you.id;
  const host = state.hostId === me;
  const inRound = state.players.filter((x) => x.inRound);
  const voted = inRound.filter((x) => x.voted).length;
  const canVote = state.you.role !== "spectator";
  return (
    <>
      <Secret {...g} />
      <Panel>
        <h2 class="center">Who's the imposter?</h2>
        {canVote ? (
          <div class="votes">
            {state.order
              .filter((id) => id !== me)
              .map((id) => (
                <button aria-pressed={state.you.vote === id} onClick={() => send({ t: "vote", target: id })}>
                  {nameOf(state, id)}
                  {inRound.find((x) => x.id === id)?.voted ? " ✓" : ""}
                </button>
              ))}
            <button class="skip" aria-pressed={state.you.vote === SKIP} onClick={() => send({ t: "vote", target: SKIP })}>
              Skip vote
            </button>
          </div>
        ) : null}
        <p class="hint center">
          {voted} of {inRound.length} voted · you can change your vote until everyone's in
        </p>
      </Panel>
      <ClueList state={state} />
      {host && (
        <button class="ghost" onClick={() => send({ t: "endVote" })}>
          End voting now
        </button>
      )}
    </>
  );
}

function Guess(g: G & { left: number | null }) {
  const { state, send } = g;
  const mine = state.accused === state.you.id;
  return (
    <>
      <Panel class="center">
        <div class="banner lose">{mine ? "You were caught!" : `${nameOf(state, state.accused)} was the imposter!`}</div>
        <p class="hint">{mine ? "Guess the word to steal the win." : "They get one guess at the word to steal the win…"}</p>
        <Timer left={g.left} />
      </Panel>
      {mine && (
        <div class="options">
          {state.options!.map((w) => (
            <button onClick={() => send({ t: "guess", word: w })}>{w}</button>
          ))}
        </div>
      )}
      {!mine && <ClueList state={state} />}
    </>
  );
}

function Result({ state, send }: G) {
  const r = state.result!;
  const me = state.you.id;
  const host = state.hostId === me;
  const o = r.outcome;
  const impNames = r.imposters.map((id) => nameOf(state, id));
  const imps = r.imposters.length > 1 ? "Imposters" : "Imposter";
  const crewWon = o.kind === "caught" && !o.correct;
  const iWon = (r.gains[me] ?? 0) > 0;
  const headline =
    o.kind === "caught"
      ? o.correct
        ? `${nameOf(state, o.ejected)} stole it!`
        : "Crew wins!"
      : o.reason === "wrong"
        ? `${imps} escaped!`
        : o.reason === "tie"
          ? "Tied vote: imposter escapes"
          : "Vote skipped: imposter escapes";
  const detail =
    o.kind === "caught"
      ? o.correct
        ? `Caught, but guessed the word.`
        : o.guessed
          ? `Caught, and guessed "${o.guessed}".`
          : "Caught, and ran out of time to guess."
      : o.reason === "wrong"
        ? `${nameOf(state, o.ejected)} was voted out, but was crew.`
        : "";
  const votesFor = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const [v, t] of Object.entries(r.votes)) m.set(t, [...(m.get(t) ?? []), nameOf(state, v)]);
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [r]);
  return (
    <>
      <Panel class="center">
        <div class={`banner ${crewWon ? "win" : "lose"}`}>{headline}</div>
        {detail && <p class="hint" style="margin-top:0">{detail}</p>}
        {state.you.role !== "spectator" && <p class={iWon ? "ok" : "hint"}>{iWon ? `You scored +${r.gains[me]}` : "No points for you this round"}</p>}
        <div class="hint">The word was</div>
        <div class="word">{r.word}</div>
        <div class="cat">{r.cat}</div>
        <div class="hint" style="margin-top:14px">{imps}</div>
        <ul class="list">
          {impNames.map((n) => (
            <li>{n}</li>
          ))}
        </ul>
      </Panel>
      {votesFor.length > 0 && (
        <Panel>
          <span class="lbl">Votes</span>
          {votesFor.map(([t, by]) => (
            <div class="tally">
              <span>
                {t === SKIP ? "Skip" : nameOf(state, t)} <b>{by.length}</b>
              </span>
              <span class="who-v">{by.join(", ")}</span>
            </div>
          ))}
        </Panel>
      )}
      <ClueList state={state} />
      {host ? (
        <>
          <button class="big" onClick={() => send({ t: "next" })}>
            Next round
          </button>
          <button class="ghost" onClick={() => send({ t: "lobby" })}>
            Back to lobby
          </button>
        </>
      ) : (
        <Panel class="center">
          <p class="hint" style="margin:0">Waiting for {nameOf(state, state.hostId)} to start the next round…</p>
        </Panel>
      )}
    </>
  );
}

function Scores({ state }: { state: RoomState }) {
  if (state.round < 2 && state.phase !== "result") return null;
  const sorted = [...state.players].sort((a, b) => b.score - a.score);
  return (
    <Panel>
      <span class="lbl">Scoreboard</span>
      <ul class="players">
        {sorted.map((pl) => (
          <li>
            <span class={`dot${pl.connected ? "" : " off"}`} />
            <span class="nm">
              {pl.name} {pl.id === state.you.id && <span class="badge me">You</span>}
            </span>
            <span class="score">{pl.score}</span>
          </li>
        ))}
      </ul>
      <small>Crew catch the imposter: +1 each, +2 if you voted them. Imposter escapes: +2. Caught but guesses the word: +2 (other imposters +1).</small>
    </Panel>
  );
}
