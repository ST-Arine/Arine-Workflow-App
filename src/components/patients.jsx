import { C, serif, sans } from "../theme";
import { Check, ChevronDown, User, AlertCircle } from "./icons";
import { Dropdown, DropdownItem } from "./menus";
import { Badge } from "./ui";

// Groups items by patient (in the engagement's patient order). Anything without a known patient lands in "Unassigned".
export function groupByPatient(items, patients) {
  const groups = patients.map((patient) => ({ patient, items: items.filter((i) => i.patientId === patient.id) }));
  const known = new Set(patients.map((p) => p.id));
  const orphans = items.filter((i) => !known.has(i.patientId));
  if (orphans.length) groups.push({ patient: { id: "none", name: "Unassigned" }, items: orphans });
  return groups.filter((g) => g.items.length > 0);
}

// Small chip that shows which patient an item applies to and lets the user change it.
// needsCheck: the system wasn't sure, so the chip asks the user to confirm (picking any patient, even the same one, confirms).
export function PatientPicker({ patients, value, onChange, needsCheck = false, disabled = false, caption = true }) {
  const current = patients.find((p) => p.id === value);
  const chipStyle = {
    ...sans, background: needsCheck ? C.amberSoft : "rgba(255,255,255,0.08)", color: needsCheck ? C.amber : C.ink,
    borderColor: needsCheck ? C.amber : C.border,
  };
  const content = () => (
    <>
      {needsCheck ? <AlertCircle size={11} /> : <User size={11} />} {current ? current.name : "Choose patient"}
      {!disabled && <ChevronDown size={11} />}
    </>
  );
  if (disabled) {
    return <span style={chipStyle} className="text-xs font-semibold px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 whitespace-nowrap">{content()}</span>;
  }
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Dropdown
        panelWidth={220}
        align="right"
        trigger={({ toggle }) => (
          <button onClick={toggle} title="Change patient" aria-label="Change patient" style={chipStyle} className="text-xs font-semibold px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 whitespace-nowrap">
            {content()}
          </button>
        )}
      >
        <>
          <div style={{ ...sans, color: C.inkFaint }} className="text-xs px-3 py-1 uppercase tracking-wide">Applies to</div>
          {patients.map((p) => (
            <DropdownItem key={p.id} onClick={() => onChange(p.id)} icon={p.id === value ? Check : undefined}>{p.name}</DropdownItem>
          ))}
        </>
      </Dropdown>
      {needsCheck && caption && <span style={{ ...sans, color: C.amber }} className="text-[11px] pl-1">Confirm patient</span>}
    </span>
  );
}

// Section heading for a patient's group of items: name, DOB / MRN and an item count.
export function PatientHeader({ patient, count, compact = false }) {
  const initials = patient.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className={`flex items-center gap-2 ${compact ? "mb-1.5" : "mb-2"}`}>
      <span
        aria-hidden="true"
        style={{ width: compact ? 18 : 24, height: compact ? 18 : 24, borderRadius: "50%", background: "linear-gradient(135deg, #FF5DA2, #8B7CF6)", color: "#1B0F2E", ...serif, fontWeight: 600, fontSize: compact ? 9 : 11 }}
        className="flex items-center justify-center flex-shrink-0"
      >
        {initials}
      </span>
      <span style={{ ...serif, color: C.ink }} className={compact ? "text-sm" : "text-base"}>{patient.name}</span>
      {patient.dob && !compact && <span style={{ ...sans, color: C.inkFaint }} className="text-xs">{patient.dob} · {patient.mrn}</span>}
      {count != null && !compact && <span style={{ marginLeft: "auto" }}><Badge tone="muted">{count} item{count === 1 ? "" : "s"}</Badge></span>}
    </div>
  );
}
