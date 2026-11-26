import type { Game } from "./words";

export type Settings = {
  /** Which game the words come from. */
  game: Game;
  imposters: number;
  /** Imposter is told the category. */
  hint: boolean;
  /** Enabled word pools. */
  cats: string[];
  /** Typed clue rounds before voting. 0 = clues are spoken (voice call / same room). INF = until the host starts the vote. */
  clueRounds: number;
  /** Seconds of discussion before voting opens. 0 = skip straight to voting (voice mode: host opens it). INF = until the host opens voting. */
  discussSeconds: number;
  /** Seconds each player has to type a clue. 0 = no limit. */
  clueSeconds: number;
};

export const DEFAULT_SETTINGS: Settings = {
  game: "lol",
  imposters: 1,
  hint: true,
  cats: [],
  clueRounds: 2,
  discussSeconds: 0,
  clueSeconds: 45,
};

/** Sentinel for "no limit" on clue rounds and discussion time. */
export const INF = -1;

/** Stepper choices; INF / 0-as-unlimited sit at the top end so "+" ends on ∞. */
export const CLUE_ROUND_CHOICES = [0, 1, 2, 3, 4, 5, INF];
export const CLUE_SECONDS_CHOICES = [15, 30, 45, 60, 90, 120, 0];
export const DISCUSS_CHOICES = [0, 30, 60, 90, 120, 180, 300, INF];

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 15;
export const NAME_MAX = 16;
export const CLUE_MAX = 28;

export const maxImposters = (n: number) => Math.max(1, Math.floor((n - 1) / 2));

export type Phase = "lobby" | "reveal" | "clues" | "discuss" | "vote" | "guess" | "result";

export type PublicPlayer = {
  id: string;
  name: string;
  connected: boolean;
  score: number;
  /** Taking part in the current round (false for people who joined mid-round). */
  inRound: boolean;
  ready: boolean;
  voted: boolean;
};

export type Clue = { pid: string; text: string };

export type Outcome =
  | { kind: "escaped"; reason: "tie" | "skip" | "wrong"; ejected?: string }
  | { kind: "caught"; ejected: string; guessed: string | null; correct: boolean };

export type ResultInfo = {
  word: string;
  cat: string;
  imposters: string[];
  votes: Record<string, string>;
  outcome: Outcome;
  /** Points gained this round, by player id. */
  gains: Record<string, number>;
};

export type You = {
  id: string;
  role: "crew" | "imposter" | "spectator";
  word?: string;
  cat?: string;
  /** Other imposters (only when there are several). */
  partners?: string[];
  /** Sharper hint for an imposter who speaks first. */
  sub?: string;
  /** Speaking first improved this imposter's hint. */
  bonus?: boolean;
  /** You speak first this round. */
  first?: boolean;
  vote?: string;
};

export type RoomState = {
  code: string;
  hostId: string;
  phase: Phase;
  round: number;
  settings: Settings;
  players: PublicPlayer[];
  /** Speaking / clue order for this round. */
  order: string[];
  starter?: string;
  clues: Clue[];
  /** Player whose turn it is to give a clue. */
  turn?: string;
  clueRound?: number;
  endsAt?: number;
  /** During guess phase: the accused imposter and their options. */
  accused?: string;
  options?: string[];
  result?: ResultInfo;
  you: You;
};

export type ClientMsg =
  | { t: "join"; name: string }
  | { t: "rename"; name: string }
  | { t: "settings"; settings: Partial<Settings> }
  | { t: "start" }
  | { t: "ready" }
  | { t: "clue"; text: string }
  | { t: "openVote" }
  | { t: "vote"; target: string }
  | { t: "endVote" }
  | { t: "guess"; word: string }
  | { t: "next" }
  | { t: "lobby" }
  | { t: "kick"; id: string }
  | { t: "host"; id: string }
  | { t: "leave" };

export type ServerMsg =
  | { t: "state"; state: RoomState; now: number }
  | { t: "error"; message: string }
  | { t: "kicked" };

export const SKIP = "__skip__";
