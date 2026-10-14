import { useState, useRef, useEffect } from "react";
import { C } from "../theme";
import { Check, Copy } from "./icons";
import { GhostButton } from "./ui";

// Long IDs are shown shortened (full value goes in a title/tooltip and is what gets copied)
export const shortId = (id) => `${id.slice(0, 8)}…${id.slice(-4)}`;

async function writeToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(text); return true; } catch { /* fall through to the legacy path */ }
  }
  // Fallback for older browsers or pages without clipboard permission
  const ta = document.createElement("textarea");
  ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { ok = false; }
  document.body.removeChild(ta);
  return ok;
}

// Secondary button that copies `text` to the clipboard and confirms for a couple of seconds.
export function CopyButton({ text, label = "Copy", copiedLabel = "Copied" }) {
  const [state, setState] = useState("idle"); // idle | copied | failed
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    const ok = await writeToClipboard(text);
    setState(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  const message = state === "copied" ? copiedLabel : state === "failed" ? "Couldn't copy" : label;
  return (
    <>
      <GhostButton onClick={copy}>
        {state === "copied" ? <Check size={13} color={C.green} /> : <Copy size={13} />} {message}
      </GhostButton>
      <span role="status" aria-live="polite" className="sr-only">{state === "idle" ? "" : message}</span>
    </>
  );
}
