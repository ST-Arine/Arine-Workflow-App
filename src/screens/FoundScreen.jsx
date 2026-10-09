import { C, serif, sans } from "../theme";
import { Circle, ChevronRight } from "../components/icons";
import { Badge, Panel, PrimaryButton, GhostButton, Avatar, Section } from "../components/ui";
import { PatientHeader, groupByPatient } from "../components/patients";

// ---------- FOUND ----------
export function FoundScreen({ engagement, onPrep, onShowAnother }) {
  const isPharmacy = engagement.kind === "pharmacy";
  const isProvider = engagement.kind === "provider";
  return (
    <div className="rise-in">
      <p style={{ ...sans, color: C.inkMuted }} className="text-sm mb-3">Found someone for you 🎯</p>
      <Panel className="mb-5" elevated style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: 20, right: 20 }}>
          <Badge tone={engagement.priority === "High" ? "amber" : "muted"}>{engagement.priority} priority</Badge>
        </div>
        <div className="flex items-center gap-4 mb-4" style={{ paddingRight: 90 }}>
          <Avatar name={engagement.name} kind={engagement.kind} />
          <div>
            <div style={{ ...serif, color: C.ink }} className="text-xl">{engagement.name}</div>
            <p style={{ ...sans, color: C.inkMuted }} className="text-xs mt-0.5">{engagement.reason}</p>
            {isProvider && <p style={{ ...sans, color: C.inkFaint }} className="text-xs mt-0.5">{engagement.practice}</p>}
          </div>
        </div>

        {isProvider ? (
          <Section label="Open questions by patient" first>
            <div className="flex flex-col gap-3">
              {groupByPatient(engagement.tasks, engagement.patients).map((g) => (
                <div key={g.patient.id}>
                  <PatientHeader patient={g.patient} compact />
                  <ul className="flex flex-col gap-1 pl-6">
                    {g.items.map((t) => <li key={t.id} style={{ ...sans, color: C.ink }} className="text-sm flex items-center gap-2"><Circle size={6} filled color={C.inkFaint} />{t.label}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        ) : (
          <Section label={isPharmacy ? "Bundled tasks" : "Why call now"} first>
            <ul className="flex flex-col gap-1">
              {engagement.tasks.map((t) => <li key={t.id} style={{ ...sans, color: C.ink }} className="text-sm flex items-center gap-2"><Circle size={6} filled color={C.inkFaint} />{t.label}</li>)}
            </ul>
          </Section>
        )}

        {engagement.medications && (
          <Section label="Medications">
            <ul className="flex flex-col gap-1">
              {engagement.medications.map((m, i) => (
                <li key={i} style={{ ...sans, color: C.ink }} className="text-sm">{m.name} {m.dose} — {m.freq}</li>
              ))}
            </ul>
          </Section>
        )}

        <Section label="Recent history">
          <ul className="flex flex-col gap-1">
            {engagement.history.map((h, i) => <li key={i} style={{ ...sans, color: C.ink }} className="text-sm">{h}</li>)}
          </ul>
        </Section>

        <Section label="Past notes" last>
          <ul className="flex flex-col gap-1.5">
            {engagement.pastNotes.map((n, i) => (
              <li key={i} style={{ ...sans, color: C.ink }} className="text-sm"><span style={{ color: C.inkFaint }}>{n.date} —</span> {n.note}</li>
            ))}
          </ul>
        </Section>
      </Panel>
      <div className="flex items-center gap-4">
        <GhostButton large onClick={onShowAnother}>Search Again</GhostButton>
        <PrimaryButton onClick={onPrep} icon={ChevronRight} iconRight>Prepare for Engagement</PrimaryButton>
      </div>
    </div>
  );
}
