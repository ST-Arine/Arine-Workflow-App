import { useState } from "react";
import { C, sans } from "../theme";
import { Check, Send, RotateCcw } from "../components/icons";
import { Badge, Panel, PrimaryButton } from "../components/ui";
import { PatientHeader, PatientPicker, groupByPatient } from "../components/patients";

// ---------- FAX ----------
export function FaxStep({ engagement, followUps, setFollowUps, onFinish }) {
  const patients = engagement?.patients; // provider calls: faxes are grouped by patient and can still be re-assigned before sending
  const faxes = followUps.filter((f) => f.type === "fax" && f.status === "approved");
  const [drafts, setDrafts] = useState(() => Object.fromEntries(faxes.map((f) => [f.id, f.label])));
  const send = (id) => setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, sent: true } : f)));
  const setPatient = (id, patientId) => setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, patientId } : f)));
  const allSent = faxes.length === 0 || faxes.every((f) => f.sent);

  const renderFax = (f) => (
          <Panel key={f.id}>
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span style={{ ...sans, color: C.inkMuted }} className="text-xs">To: {f.recipient}</span>
              {patients && <PatientPicker patients={patients} value={f.patientId} disabled={f.sent} onChange={(pid) => setPatient(f.id, pid)} />}
            </div>
            <textarea value={drafts[f.id]} onChange={(e) => setDrafts((d) => ({ ...d, [f.id]: e.target.value }))} disabled={f.sent} style={{ ...sans, borderColor: C.border, color: "#FFFFFF" }} className="w-full text-sm p-2 border rounded-sm mb-2" rows={2} />
            {f.sent ? <Badge tone="green"><Check size={12} /> Sent</Badge> : <PrimaryButton onClick={() => send(f.id)} icon={Send}>Send fax</PrimaryButton>}
          </Panel>
  );

  return (
    <div className="rise-in max-w-2xl">
      <p style={{ ...sans, color: C.inkMuted }} className="text-sm mb-3">
        {faxes.length === 0 ? "Nothing to fax — you're clear! 🙌" : "Almost there — check it, then send 🚀"}
      </p>
      <div className="flex flex-col gap-3 mb-5">
        {patients ? (
          <div className="flex flex-col gap-5">
            {groupByPatient(faxes, patients).map((g) => (
              <section key={g.patient.id} aria-label={`Faxes for ${g.patient.name}`}>
                <PatientHeader patient={g.patient} count={g.items.length} />
                <div className="flex flex-col gap-3">{g.items.map(renderFax)}</div>
              </section>
            ))}
          </div>
        ) : faxes.map(renderFax)}
      </div>
      <PrimaryButton disabled={!allSent} onClick={onFinish} icon={RotateCcw}>Done! Find next 🎉</PrimaryButton>
    </div>
  );
}
