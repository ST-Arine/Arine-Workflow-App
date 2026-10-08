import { C, sans } from "../theme";
import { CheckCircle2 } from "./icons";

// ---------- recap trail ----------
export function RecapTrail({ items }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-2 mb-6">
      {items.map((r, i) => (
        <div key={i} className="rise-in stagger flex items-start gap-2" style={{ animationDelay: `${i * 70}ms` }}>
          <CheckCircle2 size={14} color={C.green} />
          <span style={{ ...sans, color: C.inkMuted }} className="text-sm">{r}</span>
        </div>
      ))}
    </div>
  );
}
