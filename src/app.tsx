import { useEffect, useState } from "preact/hooks";
import { Local } from "./local";
import { Online } from "./online";
import { NAME_MAX } from "./shared/types";
import { cleanCode, newCode, store } from "./store";
import { Panel } from "./ui";

type Route = { kind: "home" } | { kind: "local" } | { kind: "room"; code: string };

const parse = (): Route => {
  const seg = location.pathname.slice(1);
  if (seg === "local") return { kind: "local" };
  const code = cleanCode(seg);
  return code.length === 4 ? { kind: "room", code } : { kind: "home" };
};

export function App() {
  const [route, setRoute] = useState<Route>(parse);
  const [name, setName] = useState(() => store.get("lolster.name", ""));
  const [named, setNamed] = useState(() => !!store.get("lolster.name", ""));
  const [join, setJoin] = useState("");

  useEffect(() => {
    const f = () => setRoute(parse());
    addEventListener("popstate", f);
    return () => removeEventListener("popstate", f);
  }, []);

  const go = (r: Route) => {
    const path = r.kind === "home" ? "/" : r.kind === "local" ? "/local" : `/${r.code}`;
    if (location.pathname !== path) history.pushState(null, "", path);
    setRoute(r);
    scrollTo(0, 0);
  };
  const saveName = (v: string) => {
    setName(v);
    store.set("lolster.name", v.trim());
  };
  const clean = name.trim();

  if (route.kind === "local")
    return (
      <main>
        <Header small />
        <Local onExit={() => go({ kind: "home" })} />
      </main>
    );

  if (route.kind === "room" && clean && named)
    return (
      <main>
        <Online code={route.code} name={clean} onExit={() => go({ kind: "home" })} />
      </main>
    );

  if (route.kind === "room")
    return (
      <main>
        <Header />
        <Panel>
          <h2>Join lobby {route.code}</h2>
          <form class="stack" onSubmit={(e) => { e.preventDefault(); if (clean) setNamed(true); }}>
            <NameInput value={name} onChange={saveName} autoFocus />
            <button class="big" disabled={!clean}>Join</button>
          </form>
        </Panel>
        <button class="ghost" onClick={() => go({ kind: "home" })}>Home</button>
      </main>
    );

  const code = cleanCode(join);
  return (
    <main>
      <Header />
      <Panel>
        <div class="stack">
          <NameInput value={name} onChange={saveName} />
          <button class="big" disabled={!clean} onClick={() => { setNamed(true); go({ kind: "room", code: newCode() }); }}>
            Create online lobby
          </button>
          <div class="or">or join with a code</div>
          <form class="split" onSubmit={(e) => { e.preventDefault(); if (clean && code.length === 4) { setNamed(true); go({ kind: "room", code }); } }}>
            <input class="text code-input" value={join} maxLength={4} placeholder="CODE" aria-label="Lobby code" autocomplete="off"
              onInput={(e) => setJoin(cleanCode((e.target as HTMLInputElement).value))} />
            <button type="submit" disabled={!clean || code.length !== 4}>Join</button>
          </form>
          {!clean && <small>Pick a summoner name first.</small>}
        </div>
      </Panel>
      <Panel>
        <div class="row">
          <span class="lbl">
            Pass & play
            <small class="note">One phone, passed around the table</small>
          </span>
          <button onClick={() => go({ kind: "local" })}>Play</button>
        </div>
      </Panel>
      <Panel>
        <span class="lbl">How it works</span>
        <ol class="hint" style="padding-left:20px;margin:6px 0 0">
          <li>Everyone gets the same League word, except the imposter.</li>
          <li>Take turns giving one clue. Not too obvious, not too vague.</li>
          <li>Vote out the imposter. If caught, they get one guess at the word to steal the win.</li>
        </ol>
      </Panel>
      <p class="foot">Fan-made party game. Not endorsed by Riot Games.</p>
    </main>
  );
}

function Header({ small }: { small?: boolean }) {
  return (
    <>
      <h1 style={small ? "font-size:30px" : undefined}>Lolster</h1>
      {!small && <p class="sub">Find the summoner who doesn't know the word.</p>}
    </>
  );
}

function NameInput(p: { value: string; onChange: (v: string) => void; autoFocus?: boolean }) {
  return (
    <input class="text" value={p.value} maxLength={NAME_MAX} placeholder="Summoner name" aria-label="Summoner name" autoFocus={p.autoFocus}
      autocomplete="nickname" onInput={(e) => p.onChange((e.target as HTMLInputElement).value)} />
  );
}
