import { useState } from "react";
import { C, sans } from "../theme";
import { Check, AlertCircle } from "./icons";
import { Badge, PrimaryButton } from "./ui";

// ---------- unblock component library (allow-listed, named components the AI can request) ----------
export function AddCareTeamMember({ engagement, data, onResolved }) {
  const [query, setQuery] = useState("");
  const existing = engagement.careTeam || [];
  return (
    <div style={{ background: C.amberSoft, borderColor: C.amber }} className="border rounded-sm p-3 mt-2">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle size={14} color={C.amber} />
        <span style={{ ...sans, color: C.ink }} className="text-sm font-medium">Needs one more thing</span>
      </div>
      <p style={{ ...sans, color: C.ink }} className="text-sm mb-2">
        {data.entityName} isn't on {engagement.name.split(" ")[0]}'s care team yet. Add them before this can be sent.
      </p>
      <div style={{ ...sans, color: C.inkMuted }} className="text-xs mb-1">Current care team</div>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {existing.map((m) => <Badge key={m} tone="muted">{m}</Badge>)}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search or confirm "${data.entityName}"`}
          style={{ ...sans, borderColor: C.border, color: "#FFFFFF" }}
          className="flex-1 text-sm px-2 py-1.5 border rounded-sm"
        />
        <PrimaryButton onClick={() => onResolved(data.entityName)} icon={Check}>Add & continue</PrimaryButton>
      </div>
      <div style={{ ...sans, color: C.inkFaint }} className="text-xs mt-2 font-mono">component: add_care_team_member</div>
    </div>
  );
}

export const UNBLOCK_COMPONENTS = {
  add_care_team_member: AddCareTeamMember,
};
