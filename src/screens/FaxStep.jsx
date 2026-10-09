import { useState } from "react";
import { C, sans } from "../theme";
import { Check, Send, RotateCcw } from "../components/icons";
import { Badge, Panel, PrimaryButton } from "../components/ui";

// ---------- FAX ----------
export function FaxStep({ followUps, setFollowUps, onFinish }) {
  const faxes = followUps.filter((f) => f.type === "fax" && f.status === "approved");
  const [drafts, setDrafts] = useState(() => Object.fromEntries(faxes.map((f) => [f.id, f.label])));
  const send = (id) => setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, sent: true } : f)));
  const allSent = faxes.length === 0 || faxes.every((f) => f.sent);

  return (
    <div className="rise-in max-w-2xl">
      <p style={{ ...sans, color: C.inkMuted }} className="text-sm mb-3">
        {faxes.length === 0 ? "Nothing to fax — you're clear! 🙌" : "Almost there — check it, then send 🚀"}
      </p>
      <div className="flex flex-col gap-3 mb-5">
        {faxes.map((f) => (
          <Panel key={f.id}>
            <div style={{ ...sans, color: C.inkMuted }} className="text-xs mb-2">To: {f.recipient}</div>
            <textarea value={drafts[f.id]} onChange={(e) => setDrafts((d) => ({ ...d, [f.id]: e.target.value }))} disabled={f.sent} style={{ ...sans, borderColor: C.border, color: "#FFFFFF" }} className="w-full text-sm p-2 border rounded-sm mb-2" rows={2} />
            <div className="flex justify-end">
              {f.sent ? <Badge tone="green"><Check size={12} /> Sent</Badge> : <PrimaryButton onClick={() => send(f.id)} icon={Send}>Send fax</PrimaryButton>}
            </div>
          </Panel>
        ))}
      </div>
      <div className="flex justify-end">
        <PrimaryButton disabled={!allSent} onClick={onFinish} icon={RotateCcw}>Done! Find next 🎉</PrimaryButton>
      </div>
    </div>
  );
}
