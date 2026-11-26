import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import { GAMES, poolNames, type Game } from "./shared/words";

export function Stepper(p: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  /** Step through these exact choices instead of min..max. */
  values?: number[];
  onChange?: (v: number) => void;
  format?: (v: number) => string;
}) {
  const ro = !p.onChange;
  const vals = p.values;
  const idx = vals ? Math.max(0, vals.indexOf(p.value)) : 0;
  const canDec = vals ? idx > 0 : p.value > (p.min ?? -Infinity);
  const canInc = vals ? idx < vals.length - 1 : p.value < (p.max ?? Infinity);
  const dec = () => p.onChange!(vals ? vals[idx - 1] : p.value - 1);
  const inc = () => p.onChange!(vals ? vals[idx + 1] : p.value + 1);
  return (
    <div class="row">
      <span class="lbl">{p.label}</span>
      <div class="step">
        {!ro && (
          <button aria-label={`Fewer ${p.label}`} disabled={!canDec} onClick={dec}>
            −
          </button>
        )}
        <b>{p.format ? p.format(p.value) : p.value}</b>
        {!ro && (
          <button aria-label={`More ${p.label}`} disabled={!canInc} onClick={inc}>
            +
          </button>
        )}
      </div>
    </div>
  );
}

export function Switch(p: { label: string; checked: boolean; onChange?: (v: boolean) => void; note?: string }) {
  return (
    <label class="row">
      <span class="lbl">
        {p.label}
        {p.note && <small class="note">{p.note}</small>}
      </span>
      <input
        type="checkbox"
        class="sw"
        checked={p.checked}
        disabled={!p.onChange}
        onChange={(e) => p.onChange?.((e.target as HTMLInputElement).checked)}
      />
    </label>
  );
}

export function Pools(p: { game: Game; value: string[]; onChange?: (v: string[]) => void }) {
  const POOL_NAMES = poolNames(p.game);
  const toggle = (k: string) => {
    if (!p.onChange) return;
    const next = p.value.includes(k) ? p.value.filter((x) => x !== k) : [...p.value, k];
    p.onChange(next.length ? next : [k]);
  };
  return (
    <div class="panel">
      <div class="row">
        <span class="lbl">Word pools</span>
        {p.onChange && (
          <button class="link" onClick={() => p.onChange!(p.value.length === POOL_NAMES.length ? [POOL_NAMES[0]] : [...POOL_NAMES])}>
            {p.value.length === POOL_NAMES.length ? "Only one" : "All"}
          </button>
        )}
      </div>
      <div class="chips">
        {POOL_NAMES.map((k) => (
          <button class="chip" aria-pressed={p.value.includes(k)} disabled={!p.onChange} onClick={() => toggle(k)}>
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Seconds as "45s" / "1:30"; 0 or less means no limit. */
export const fmtTime = (s: number) => (s <= 0 ? "∞" : s < 60 ? `${s}s` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`);

/** Live countdown to an absolute timestamp. `offset` corrects for server clock skew. */
export function useCountdown(endsAt: number | undefined, offset = 0) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!endsAt) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [endsAt]);
  if (!endsAt) return null;
  return Math.max(0, Math.ceil((endsAt - (now + offset)) / 1000));
}

export function Timer(p: { left: number | null; total?: number; done?: string }) {
  if (p.left == null) return null;
  const urgent = p.left <= 10;
  return (
    <div class={`timer${urgent ? " urgent" : ""}`} role="timer" aria-live={urgent ? "polite" : "off"}>
      {p.left === 0 && p.done ? p.done : `${Math.floor(p.left / 60)}:${String(p.left % 60).padStart(2, "0")}`}
    </div>
  );
}

export type CardFace =
  | { kind: "crew"; word: string; cat: string }
  | { kind: "imposter"; cat?: string; partners?: string[]; sub?: string; bonus?: boolean };

/** The flip card: front shows who it belongs to, back shows the secret. */
export function Card(p: {
  who: string;
  face: CardFace;
  flipped: boolean;
  onFlip: (v: boolean) => void;
  hint?: string;
  /** Discreet: only visible while held, same colours for every role. */
  discreet?: boolean;
}) {
  const imp = p.face.kind === "imposter" && !p.discreet;
  const hold = useHold(p.discreet ? p.onFlip : undefined);
  return (
    <button
      class={`card${p.flipped ? " flip" : ""}${p.discreet ? " discreet" : ""}`}
      onClick={p.discreet ? undefined : () => p.onFlip(!p.flipped)}
      {...hold}
      aria-label={p.discreet ? `Hold to reveal card for ${p.who}` : p.flipped ? "Hide card" : `Reveal card for ${p.who}`}
    >
      <div class="inner">
        <div class="face front" aria-hidden={p.flipped}>
          <div class="rune">
            <span>?</span>
          </div>
          <div class="who">{p.who}</div>
          <div class="hint">{p.hint ?? (p.discreet ? "Hold to peek. Release to hide." : "Only you should look. Tap to reveal.")}</div>
        </div>
        <div class={`face back${imp ? " imp" : ""}`} aria-hidden={!p.flipped}>
          {p.face.kind === "crew" ? (
            <>
              <div class="tag">Your word</div>
              <div class="word">{p.face.word}</div>
              <div class="cat">{p.face.cat}</div>
            </>
          ) : (
            <>
              <div class="tag">You are the</div>
              <div class="word">Imposter</div>
              <div class="cat">{p.face.cat ? `Category: ${p.face.cat}${p.face.sub ? ` › ${p.face.sub}` : ""}` : "No hint. Blend in and work it out."}</div>
              {p.face.bonus && p.face.cat && (
                <div class="hint">{p.face.sub ? "You speak first, so your hint is sharper." : "You speak first, so you get the category as a bonus."}</div>
              )}
              {p.face.partners?.length ? <div class="hint">Fellow imposters: {p.face.partners.join(", ")}</div> : null}
            </>
          )}
        </div>
      </div>
    </button>
  );
}

export function Panel(p: { children: ComponentChildren; class?: string }) {
  return <div class={`panel ${p.class ?? ""}`}>{p.children}</div>;
}

export function Toast(p: { msg: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!p.msg) return;
    const t = setTimeout(p.onDone, 3200);
    return () => clearTimeout(t);
  }, [p.msg]);
  return p.msg ? (
    <div class="toast" role="status">
      {p.msg}
    </div>
  ) : null;
}

/** Press-and-hold handlers (pointer + Space/Enter). Pass undefined to disable. */
export function useHold(set?: (v: boolean) => void) {
  if (!set) return {};
  const on = (e: Event) => {
    e.preventDefault();
    set(true);
  };
  const off = () => set(false);
  return {
    onPointerDown: on,
    onPointerUp: off,
    onPointerLeave: off,
    onPointerCancel: off,
    onContextMenu: (e: Event) => e.preventDefault(),
    onKeyDown: (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) on(e);
    },
    onKeyUp: (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") off();
    },
    onBlur: off,
  };
}

/** A small "hold to peek" pill showing your secret during clue/vote phases. */
export function Peek(p: { label: string; secret: string; discreet: boolean }) {
  const [open, setOpen] = useState(false);
  const hold = useHold(p.discreet ? setOpen : undefined);
  return (
    <button class={`peek${open ? " open" : ""}`} onClick={p.discreet ? undefined : () => setOpen(!open)} {...hold}>
      {open ? p.secret : p.discreet ? `Hold to peek ${p.label}` : `Tap to show ${p.label}`}
    </button>
  );
}

/** Full-screen privacy cover. Press C to toggle; any key or click lifts it. */
export function useCover() {
  const [covered, setCovered] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (covered) {
        e.preventDefault();
        setCovered(false);
      } else if (e.key === "c" || e.key === "C") setCovered(true);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [covered]);
  const overlay = covered ? (
    <button class="cover" onClick={() => setCovered(false)} aria-label="Uncover screen">
      <span class="cover-logo">Lolster</span>
      <span class="hint">Screen covered. Click or press any key to uncover.</span>
    </button>
  ) : null;
  return { covered, cover: () => setCovered(true), overlay };
}

/** League / Deadlock switch. */
export function GamePicker(p: { value: Game; onChange?: (g: Game) => void }) {
  return (
    <div class="seg" role="radiogroup" aria-label="Game">
      {(Object.keys(GAMES) as Game[]).map((g) => (
        <button role="radio" aria-checked={p.value === g} disabled={!p.onChange && p.value !== g} onClick={() => p.onChange?.(g)}>
          {GAMES[g].label}
        </button>
      ))}
    </div>
  );
}
