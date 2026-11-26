import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { CHAT_MAX, type ChatMsg } from "./shared/types";

/** Wide screens show the chat as a column on the right; narrow ones get a slide-in drawer. */
const WIDE = "(min-width: 960px)";

function useMedia(q: string) {
  const [m, setM] = useState(() => matchMedia(q).matches);
  useEffect(() => {
    const mq = matchMedia(q);
    const f = () => setM(mq.matches);
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [q]);
  return m;
}

const clock = (at: number) => new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function Chat(p: { log: ChatMsg[]; me: string; hostId: string; onSend: (text: string) => void }) {
  const wide = useMedia(WIDE);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [seen, setSeen] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const stick = useRef(true);
  const visible = wide || open;
  const last = p.log.length ? p.log[p.log.length - 1].id : 0;

  // Everything is read while the chat is on screen.
  useEffect(() => {
    if (visible) setSeen(last);
  }, [visible, last]);
  const unread = visible ? 0 : p.log.filter((m) => m.id > seen && !m.sys && m.pid !== p.me).length;

  // Follow new messages unless the reader has scrolled up.
  useLayoutEffect(() => {
    const el = list.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [last, visible]);

  useEffect(() => {
    if (!open || wide) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [open, wide]);

  const submit = (e: Event) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    p.onSend(t);
    setText("");
    stick.current = true;
  };

  return (
    <>
      {!wide && (
        <button class="chat-fab" onClick={() => setOpen(true)} aria-label={unread ? `Chat, ${unread} unread` : "Chat"} hidden={open}>
          Chat
          {unread > 0 && <span class="chat-unread">{unread > 99 ? "99+" : unread}</span>}
        </button>
      )}
      {!wide && open && <div class="chat-scrim" onClick={() => setOpen(false)} />}
      <aside class={`chat panel${visible ? " open" : ""}`} aria-label="Lobby chat" aria-hidden={!visible}>
        <div class="chat-head">
          <span class="lbl">Chat</span>
          {!wide && (
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              ✕
            </button>
          )}
        </div>
        <ol
          class="chat-log"
          ref={list}
          aria-live="polite"
          onScroll={(e) => {
            const el = e.currentTarget as HTMLElement;
            stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
          }}
        >
          {!p.log.length && <li class="sys">No messages yet. Say hi!</li>}
          {p.log.map((m) =>
            m.sys ? (
              <li class="sys" key={m.id} title={clock(m.at)}>
                {m.text}
              </li>
            ) : (
              <li class={m.pid === p.me ? "mine" : ""} key={m.id} title={clock(m.at)}>
                <b class="by">
                  {m.name}
                  {m.pid === p.hostId && <span class="badge">Host</span>}
                </b>
                <span class="tx">{m.text}</span>
              </li>
            ),
          )}
        </ol>
        <form class="split chat-form" onSubmit={submit}>
          <input
            class="text"
            value={text}
            maxLength={CHAT_MAX}
            placeholder="Message"
            aria-label="Chat message"
            autocomplete="off"
            enterkeyhint="send"
            tabIndex={visible ? 0 : -1}
            onInput={(e) => setText((e.target as HTMLInputElement).value)}
          />
          <button type="submit" disabled={!text.trim()} tabIndex={visible ? 0 : -1}>
            Send
          </button>
        </form>
      </aside>
    </>
  );
}
