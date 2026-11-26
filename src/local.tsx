import { useEffect, useState } from "preact/hooks";
import { maxImposters, MAX_PLAYERS, MIN_PLAYERS, NAME_MAX } from "./shared/types";
import { drawWord, imposterIntel, POOL_NAMES, shuffle } from "./shared/words";
import { store } from "./store";
import { Card, fmtTime, Panel, Pools, Stepper, Switch, Timer, type CardFace } from "./ui";

type LocalSettings = { n: number; imp: number; hint: boolean; seconds: number; cats: string[]; names: string[] };
type Round = {
  word: string;
  cat: string;
  imps: Set<number>;
  faces: CardFace[];
  starter: number;
};

const DEFAULTS: LocalSettings = { n: 5, imp: 1, hint: true, seconds: 180, cats: [...POOL_NAMES], names: [] };
const TIMES = [0, 60, 120, 180, 240, 300];

export function Local(p: { onExit: () => void }) {
  const [s, setS] = useState<LocalSettings>(() => {
    const v = { ...DEFAULTS, ...store.get<Partial<LocalSettings>>("lolster.local", {}) };
    v.cats = v.cats.filter((c) => POOL_NAMES.includes(c));
    if (!v.cats.length) v.cats = [...POOL_NAMES];
    return v;
  });
  const [stage, setStage] = useState<"setup" | "pass" | "talk">("setup");
  const [round, setRound] = useState<Round | null>(null);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [endsAt, setEndsAt] = useState<number | undefined>();
  const [recent, setRecent] = useState<string[]>([]);

  const update = (patch: Partial<LocalSettings>) => {
    const next = { ...s, ...patch };
    next.imp = Math.min(next.imp, maxImposters(next.n));
    setS(next);
    store.set("lolster.local", next);
  };
  const name = (i: number) => s.names[i]?.trim() || `Player ${i + 1}`;

  const start = () => {
    const { cat, word } = drawWord(s.cats, recent);
    setRecent([word, ...recent].slice(0, 40));
    const imps = new Set(shuffle([...Array(s.n).keys()]).slice(0, s.imp));
    const starter = Math.floor(Math.random() * s.n);
    const faces: CardFace[] = [...Array(s.n).keys()].map((i) =>
      imps.has(i)
        ? { kind: "imposter", first: i === starter, ...imposterIntel(cat, word, s.hint, i === starter) }
        : { kind: "crew", word, cat },
    );
    setRound({ word, cat, imps, faces, starter });
    setIdx(0);
    setFlipped(false);
    setSeen(false);
    setRevealed(false);
    setStage("pass");
  };

  const next = () => {
    if (!seen) {
      setFlipped(true);
      setSeen(true);
      return;
    }
    setFlipped(false);
    setSeen(false);
    setTimeout(() => {
      if (idx < s.n - 1) setIdx(idx + 1);
      else {
        setStage("talk");
        setEndsAt(s.seconds ? Date.now() + s.seconds * 1000 : undefined);
      }
    }, 260);
  };

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!endsAt || revealed) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [endsAt, revealed]);
  const left = endsAt && !revealed ? Math.max(0, Math.ceil((endsAt - now) / 1000)) : null;

  if (stage === "setup")
    return (
      <section>
        <Panel>
          <Stepper label="Players" value={s.n} min={MIN_PLAYERS} max={MAX_PLAYERS} onChange={(n) => update({ n })} />
          <Stepper label="Imposters" value={s.imp} min={1} max={maxImposters(s.n)} onChange={(imp) => update({ imp })} />
          <Switch label="Imposter sees category" checked={s.hint} onChange={(hint) => update({ hint })} />
          <Stepper
            label="Discussion timer"
            value={TIMES.indexOf(s.seconds) < 0 ? 3 : TIMES.indexOf(s.seconds)}
            min={0}
            max={TIMES.length - 1}
            format={(i) => fmtTime(TIMES[i])}
            onChange={(i) => update({ seconds: TIMES[i] })}
          />
        </Panel>
        <Pools value={s.cats} onChange={(cats) => update({ cats })} />
        <Panel>
          <span class="lbl">
            Names <small class="note">optional</small>
          </span>
          <div class="names">
            {Array.from({ length: s.n }, (_, i) => (
              <input
                class="text"
                placeholder={`Player ${i + 1}`}
                value={s.names[i] ?? ""}
                maxLength={NAME_MAX}
                aria-label={`Player ${i + 1} name`}
                onInput={(e) => {
                  const names = [...s.names];
                  names[i] = (e.target as HTMLInputElement).value;
                  update({ names });
                }}
              />
            ))}
          </div>
        </Panel>
        <button class="big" onClick={start}>
          Start round
        </button>
        <button class="ghost" onClick={p.onExit}>
          Back
        </button>
      </section>
    );

  const r = round!;
  if (stage === "pass")
    return (
      <section>
        <div class="prog">
          Card {idx + 1} of {s.n}
        </div>
        <Card
          who={name(idx)}
          face={r.faces[idx]}
          flipped={flipped}
          onFlip={(v) => {
            if (v && !seen) next();
            else setFlipped(v);
          }}
        />
        {flipped && r.starter === idx && r.faces[idx].kind === "crew" && <p class="hint center">You'll give the first clue.</p>}
        <button class="big" onClick={next}>
          {!seen ? "Reveal" : idx < s.n - 1 ? `Hide & pass to ${name(idx + 1)}` : "Hide & start"}
        </button>
      </section>
    );

  return (
    <section>
      <Panel class="center">
        <div class="hint">Everyone has seen their card.</div>
        <div class="who" style="margin:10px 0">
          {name(r.starter)} starts
        </div>
        <div class="hint">Go around giving one clue each, then point at the imposter on three.</div>
        <Timer left={left} done="Vote!" />
      </Panel>
      {!revealed ? (
        <button class="big" onClick={() => setRevealed(true)}>
          Reveal imposter
        </button>
      ) : (
        <>
          <Panel class="center">
            <div class="hint">The word was</div>
            <div class="word">{r.word}</div>
            <div class="cat">{r.cat}</div>
            <div class="hint" style="margin-top:14px">
              {r.imps.size > 1 ? "Imposters" : "Imposter"}
            </div>
            <ul class="list">
              {[...r.imps].map((i) => (
                <li>{name(i)}</li>
              ))}
            </ul>
            <div class="hint" style="margin-top:12px">
              Caught imposter? They get one guess at the word to steal the win.
            </div>
          </Panel>
          <button class="big" onClick={start}>
            New round
          </button>
        </>
      )}
      <button class="ghost" onClick={() => setStage("setup")}>
        Settings
      </button>
    </section>
  );
}
