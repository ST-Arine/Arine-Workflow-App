import { useState } from "react";
import { C, serif, sans } from "../theme";
import { Check, X, Phone, Pencil, Plus, AlertCircle, User } from "../components/icons";
import { Badge, Panel, PrimaryButton, GhostButton, Avatar } from "../components/ui";

// ---------- PREP ----------
export function PrepStep({ engagement, agenda, setAgenda, onBack, onStartCall }) {
  const removeItem = (id) => setAgenda(agenda.filter((a) => a.id !== id));
  const acceptSuggestion = (s) => setAgenda([...agenda, { id: s.id, label: s.label, source: "ai" }]);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [addingItem, setAddingItem] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState("");
  const stillSuggested = engagement.aiAgendaSuggestions.filter((s) => !agenda.find((a) => a.id === s.id));
  const isPharmacy = engagement.kind === "pharmacy";

  function addOwnItem() {
    if (!newItemLabel.trim()) return;
    setAgenda([...agenda, { id: `custom-${Date.now()}`, label: newItemLabel.trim(), source: "custom" }]);
    setNewItemLabel("");
    setAddingItem(false);
  }

  return (
    <div>
      <p style={{ ...sans, color: C.inkMuted }} className="text-sm mb-3">Let's get you dial-ready 📋</p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="slide-left-in w-full md:w-80 flex-shrink-0 flex flex-col gap-4">
          <Panel>
            <div className="flex items-center gap-4 mb-1">
              <Avatar name={engagement.name} kind={engagement.kind} />
              <div style={{ ...serif, color: C.ink }} className="text-xl">{engagement.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-y-1 mt-3" style={{ ...sans, color: C.inkMuted }}>
              <span className="text-xs">Phone</span><span className="text-xs text-right" style={{ color: C.ink }}>{engagement.phone}</span>
              {engagement.mrn && (<><span className="text-xs">MRN</span><span className="text-xs text-right" style={{ color: C.ink }}>{engagement.mrn}</span></>)}
              {engagement.dob && (<><span className="text-xs">DOB</span><span className="text-xs text-right" style={{ color: C.ink }}>{engagement.dob}</span></>)}
              {engagement.insurance && (<><span className="text-xs">Insurance</span><span className="text-xs text-right" style={{ color: C.ink }}>{engagement.insurance}</span></>)}
            </div>
          </Panel>

          {!isPharmacy && (
            <Panel>
              <div style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium mb-2 uppercase tracking-wide">Medications</div>
              <ul className="flex flex-col gap-1 mb-3">
                {engagement.medications.map((m, i) => <li key={i} style={{ ...sans, color: C.ink }} className="text-sm">{m.name} {m.dose} — {m.freq}</li>)}
              </ul>
              <div style={{ borderColor: C.border }} className="border-t pt-3">
                <div style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium mb-1.5 uppercase tracking-wide">Allergies</div>
                <p style={{ ...sans, color: C.ink }} className="text-sm">{engagement.allergies}</p>
              </div>
            </Panel>
          )}

          <Panel>
            <div style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium mb-2 uppercase tracking-wide">History &amp; past notes</div>
            <ul className="flex flex-col gap-1 mb-2">
              {engagement.history.map((h, i) => <li key={i} style={{ ...sans, color: C.ink }} className="text-sm">{h}</li>)}
            </ul>
            <ul className="flex flex-col gap-1.5">
              {engagement.pastNotes.map((n, i) => (
                <li key={i} style={{ ...sans, color: C.ink }} className="text-sm"><span style={{ color: C.inkFaint }}>{n.date} —</span> {n.note}</li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="slide-right-in flex-1">
          <Panel elevated>
            <div style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium mb-3 uppercase tracking-wide">Agenda</div>
            <ul className="flex flex-col gap-2 mb-3">
              {agenda.map((a) => (
                <li key={a.id} className="flex items-center gap-2">
                  {editingId === a.id ? (
                    <>
                      <input value={draft} onChange={(e) => setDraft(e.target.value)} style={{ ...sans, borderColor: C.border, color: "#FFFFFF" }} className="flex-1 text-sm px-2 py-1 border rounded-sm" />
                      <button onClick={() => { setAgenda(agenda.map(x => x.id === a.id ? { ...x, label: draft } : x)); setEditingId(null); }} className="p-2 -m-2"><Check size={15} color={C.green} /></button>
                    </>
                  ) : (
                    <>
                      <span style={{ ...sans, color: C.ink }} className="text-sm flex-1">{a.label}</span>
                      {a.source === "ai" && <Badge tone="amber">AI added</Badge>}
                      {a.source === "custom" && <Badge tone="primary"><User size={11} /> Added by you</Badge>}
                      <button onClick={() => { setEditingId(a.id); setDraft(a.label); }} className="p-2 -m-2"><Pencil size={13} color={C.inkMuted} /></button>
                      <button onClick={() => removeItem(a.id)} className="p-2 -m-2"><X size={15} color={C.inkMuted} /></button>
                    </>
                  )}
                </li>
              ))}
            </ul>
            {stillSuggested.length > 0 && (
              <div style={{ borderColor: C.border }} className="border-t pt-3 mb-3 flex flex-col gap-2">
                {stillSuggested.map((s) => (
                  <div key={s.id} style={{ background: C.amberSoft }} className="flex items-center gap-2 p-2 rounded-sm">
                    <AlertCircle size={14} color={C.amber} />
                    <span style={{ ...sans, color: C.ink }} className="text-sm flex-1">{s.label}</span>
                    <span style={{ ...sans, color: C.inkMuted }} className="text-xs">{s.reason}</span>
                    <button onClick={() => acceptSuggestion(s)} className="p-2 -m-2"><Check size={15} color={C.green} /></button>
                  </div>
                ))}
              </div>
            )}
            {addingItem ? (
              <div className="fade-in flex flex-col gap-2">
                <input
                  autoFocus value={newItemLabel} onChange={(e) => setNewItemLabel(e.target.value)} placeholder="What should be on the agenda?"
                  onKeyDown={(e) => e.key === "Enter" && addOwnItem()}
                  style={{ ...sans, borderColor: C.border, color: "#FFFFFF" }} className="w-full text-sm px-2 py-1.5 border rounded-sm"
                />
                <div className="flex items-center gap-2">
                  <GhostButton onClick={addOwnItem}><Check size={13} color={C.green} /> Add</GhostButton>
                  <GhostButton onClick={() => { setAddingItem(false); setNewItemLabel(""); }}>Cancel</GhostButton>
                </div>
              </div>
            ) : (
              <GhostButton onClick={() => setAddingItem(true)}><Plus size={13} /> Add agenda item</GhostButton>
            )}
          </Panel>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <GhostButton onClick={onBack}>Back</GhostButton>
        <PrimaryButton onClick={onStartCall} icon={Phone}>Start the call</PrimaryButton>
      </div>
    </div>
  );
}
