import { useState } from "react";
import { C, sans } from "../theme";
import { Check, X, CheckCircle2, Pencil, Trash, Plus, ChevronRight, RotateCcw, User } from "../components/icons";
import { Badge, Panel, PrimaryButton, GhostButton } from "../components/ui";
import { UNBLOCK_COMPONENTS } from "../components/unblock";

// ---------- add-your-own follow-up ----------
export function AddFollowUpForm({ onAdd, onCancel }) {
  const [type, setType] = useState("new-task");
  const [label, setLabel] = useState("");
  const [recipient, setRecipient] = useState("");
  const typeOptions = [{ v: "data-entry", l: "Data entry" }, { v: "new-task", l: "New task" }, { v: "fax", l: "Fax" }];
  const canAdd = label.trim().length > 0 && (type !== "fax" || recipient.trim().length > 0);
  return (
    <Panel>
      <div style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium mb-2 uppercase tracking-wide">New item ✨</div>
      <div className="flex gap-1.5 mb-3">
        {typeOptions.map((o) => (
          <button key={o.v} onClick={() => setType(o.v)}
            style={{ ...sans, background: type === o.v ? C.primarySoft : "transparent", color: type === o.v ? C.primary : C.inkMuted, borderColor: type === o.v ? C.primary : C.border }}
            className="text-xs font-semibold px-3 py-1 rounded-full border">
            {o.l}
          </button>
        ))}
      </div>
      <textarea
        value={label} onChange={(e) => setLabel(e.target.value)} placeholder="What needs to happen?"
        style={{ ...sans, borderColor: C.border, color: "#FFFFFF" }} className="w-full text-sm p-2 border rounded-sm mb-2" rows={2}
      />
      {type === "fax" && (
        <input
          value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Who's it going to?"
          style={{ ...sans, borderColor: C.border, color: "#FFFFFF" }} className="w-full text-sm px-2 py-1.5 border rounded-sm mb-2"
        />
      )}
      <div className="flex items-center gap-2">
        <PrimaryButton disabled={!canAdd} onClick={() => onAdd({ type, label: label.trim(), recipient: type === "fax" ? recipient.trim() : undefined })} icon={Check}>Add it</PrimaryButton>
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
      </div>
    </Panel>
  );
}

// ---------- REVIEW ----------
export function ReviewStep({ engagement, agenda, followUps, setFollowUps, onBack, onProceed }) {
  const unresolved = agenda.filter((a) => a.status !== "confirmed");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const decide = (id, status) => setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
  const save = (id) => { setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, label: draft, status: "approved" } : f))); setEditingId(null); };
  const remove = (id) => setFollowUps((prev) => prev.filter((f) => f.id !== id));
  const resolveBlocked = (id, resolvedName) => setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, status: "pending", resolvedNote: `${resolvedName} added to care team.` } : f)));
  const addCustom = ({ type, label, recipient }) => {
    setFollowUps((prev) => [...prev, { id: `custom-${Date.now()}`, type, label, recipient, status: "approved", custom: true }]);
    setAdding(false);
  };
  const allDecided = followUps.every((f) => f.status === "approved" || f.status === "rejected");
  const typeLabel = { "data-entry": "Data entry", "new-task": "New task", fax: "Fax" };

  return (
    <div className="rise-in max-w-2xl">
      <p style={{ ...sans, color: C.inkMuted }} className="text-sm mb-3">Nice call! Let's wrap it up. Approve, edit, or skip each item — or toss in your own.</p>
      {unresolved.length > 0 && (
        <Panel className="mb-4" style={{ background: C.amberSoft, borderColor: C.amber }}>
          <p style={{ ...sans, color: C.ink }} className="text-sm">Not covered on the call: {unresolved.map((u) => u.label).join(", ")}</p>
        </Panel>
      )}
      <div className="flex flex-col gap-3 mb-5">
        {followUps.length === 0 && !adding && <Panel><p style={{ ...sans, color: C.inkMuted }} className="text-sm">Nothing yet — add one below if something came up. 👇</p></Panel>}
        {followUps.map((f) => {
          const UnblockComponent = f.status === "blocked" ? UNBLOCK_COMPONENTS[f.precondition?.component] : null;
          return (
          <Panel key={f.id}>
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <Badge tone={f.type === "fax" ? "amber" : "muted"}>{typeLabel[f.type]}</Badge>
              {f.recipient && <span style={{ ...sans, color: C.inkMuted }} className="text-xs">to {f.recipient}</span>}
              {f.custom && <Badge tone="primary"><User size={11} /> Added by you</Badge>}
              <button onClick={() => remove(f.id)} style={{ marginLeft: "auto" }} className="p-2 -m-2" title="Delete this item">
                <Trash size={14} color={C.inkFaint} />
              </button>
            </div>
            {editingId === f.id ? (
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} style={{ ...sans, borderColor: C.border, color: "#FFFFFF" }} className="w-full text-sm p-2 border rounded-sm mb-2" rows={2} />
            ) : <p style={{ ...sans, color: C.ink }} className="text-sm mb-3">{f.label}</p>}

            {f.resolvedNote && (
              <p style={{ ...sans, color: C.green }} className="text-xs mb-2 flex items-center gap-1.5"><CheckCircle2 size={12} /> {f.resolvedNote}</p>
            )}

            {f.status === "blocked" && UnblockComponent && (
              <UnblockComponent engagement={engagement} data={f.precondition.data} onResolved={(name) => resolveBlocked(f.id, name)} />
            )}

            {f.status !== "blocked" && (
              <div className="flex items-center gap-2">
                {editingId === f.id ? (
                  <>
                    <PrimaryButton onClick={() => save(f.id)}>Save</PrimaryButton>
                    <GhostButton onClick={() => setEditingId(null)}>Cancel</GhostButton>
                  </>
                ) : (
                  <>
                    {f.status === "pending" && (
                      <>
                        <GhostButton onClick={() => decide(f.id, "approved")}><Check size={13} color={C.green} /> Approve</GhostButton>
                        <GhostButton onClick={() => { setEditingId(f.id); setDraft(f.label); }}><Pencil size={13} /> Edit</GhostButton>
                        <GhostButton tone="danger" onClick={() => decide(f.id, "rejected")}><X size={13} /> Skip</GhostButton>
                      </>
                    )}
                    {f.status === "approved" && (
                      <>
                        <Badge tone="green">Approved</Badge>
                        <button onClick={() => { setEditingId(f.id); setDraft(f.label); }} title="Edit" className="p-2 -m-2"><Pencil size={13} color={C.inkFaint} /></button>
                      </>
                    )}
                    {f.status === "rejected" && (
                      <>
                        <Badge tone="muted">Skipped</Badge>
                        <button onClick={() => decide(f.id, "approved")} title="Bring it back" className="p-2 -m-2"><RotateCcw size={13} color={C.inkFaint} /></button>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </Panel>
          );
        })}
        {adding ? (
          <AddFollowUpForm onAdd={addCustom} onCancel={() => setAdding(false)} />
        ) : (
          <GhostButton onClick={() => setAdding(true)}><Plus size={13} /> Add your own item</GhostButton>
        )}
      </div>
      <div className="flex items-center gap-3">
        <GhostButton onClick={onBack}>Back</GhostButton>
        <PrimaryButton disabled={!allDecided} onClick={onProceed} icon={ChevronRight}>On to faxing</PrimaryButton>
      </div>
    </div>
  );
}
