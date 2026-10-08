import { useState } from "react";
import { C, serif, sans, AVATAR_COLORS } from "../theme";
import { X, Sparkle } from "./icons";

// ---------- small UI pieces ----------
export function Badge({ tone = "muted", children }) {
  const tones = { muted: { bg: C.surfaceAlt, fg: C.inkMuted }, amber: { bg: C.amberSoft, fg: C.amber }, green: { bg: C.greenSoft, fg: C.green }, primary: { bg: C.primarySoft, fg: C.primary } };
  const t = tones[tone];
  return <span style={{ background: t.bg, color: t.fg, ...sans, transition: "background-color 0.3s ease, color 0.3s ease" }} className="text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap">{children}</span>;
}
export function Panel({ children, style, className = "", elevated = false }) {
  return (
    <div
      className={`rounded-3xl border p-5 ${className}`}
      style={{
        background: C.surface, borderColor: C.border, backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
        boxShadow: elevated ? "0 20px 50px -24px rgba(255,93,162,0.35), 0 1px 0 rgba(255,255,255,0.06) inset" : "0 1px 0 rgba(255,255,255,0.05) inset",
        transition: "box-shadow 0.25s ease", ...style,
      }}
    >
      {children}
    </div>
  );
}
export function PrimaryButton({ children, onClick, disabled, icon: IconC }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: disabled ? "rgba(255,255,255,0.12)" : "linear-gradient(135deg, #FF5DA2, #FF9A4D)",
        color: disabled ? C.inkFaint : "#1B0F2E", ...sans, fontWeight: 700,
        transform: hover && !disabled ? "translateY(-1px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hover && !disabled ? "0 10px 28px -10px rgba(255,93,162,0.55)" : "0 6px 18px -10px rgba(255,93,162,0.4)",
      }}
      className="px-6 py-3 rounded-full text-sm inline-flex items-center gap-2 disabled:cursor-not-allowed">
      {IconC && <IconC size={16} />}{children}
    </button>
  );
}
export function GhostButton({ children, onClick, tone = "default", disabled = false }) {
  const [hover, setHover] = useState(false);
  const base = tone === "danger" ? C.danger : "#FFFFFF";
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ color: disabled ? C.inkFaint : base, borderColor: hover && !disabled ? base : C.border, background: hover && !disabled ? (tone === "danger" ? C.dangerSoft : "rgba(255,255,255,0.12)") : "rgba(255,255,255,0.04)", ...sans, fontWeight: 600 }}
      className="px-4 py-2 rounded-full text-sm border inline-flex items-center gap-1.5 disabled:cursor-not-allowed">
      {children}
    </button>
  );
}
export function TextLink({ children, onClick }) {
  return <button onClick={onClick} style={{ ...sans, color: C.primary, fontWeight: 600 }} className="text-sm underline decoration-dotted hover:opacity-80 transition-opacity">{children}</button>;
}
export function Avatar({ name, kind }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const color = AVATAR_COLORS[name.length % AVATAR_COLORS.length];
  return (
    <div
      style={{ background: `linear-gradient(135deg, ${color}, #8B7CF6)`, color: "#1B0F2E", ...serif, fontWeight: 600, boxShadow: `0 0 0 4px rgba(255,255,255,0.08), 0 8px 20px -8px ${color}66` }}
      className="pop-in w-14 h-14 rounded-full flex items-center justify-center text-xl flex-shrink-0"
    >
      {kind === "pharmacy" ? <Sparkle size={20} /> : initials}
    </div>
  );
}


export function Section({ label, children, last, first }) {
  return (
    <div style={{ borderColor: C.border }} className={`pt-3 mt-3 ${last ? "" : "border-t"} ${first ? "border-t-0 pt-0 mt-0" : ""}`}>
      <div style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium mb-1.5 uppercase tracking-wide">{label}</div>
      {children}
    </div>
  );
}


// ---------- CALL ----------
export function Modal({ onClose, children }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(10,6,20,0.6)", backdropFilter: "blur(3px)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="rise-in glass" style={{ borderRadius: 20, padding: 24, width: 360, maxWidth: "100%", boxShadow: "0 24px 60px -16px rgba(0,0,0,0.5)", position: "relative" }}>
        <button onClick={onClose} className="p-2" style={{ position: "absolute", top: 6, right: 6 }}>
          <X size={16} color={C.inkMuted} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function IconToggle({ active, onClick, icon: IconC, label, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...sans, background: active ? C.primarySoft : "transparent", color: active ? C.primary : C.inkMuted, borderColor: active ? C.primary : C.border }}
      className="px-3 py-2 rounded-full border flex items-center gap-1.5 text-xs font-semibold disabled:opacity-40 flex-shrink-0 whitespace-nowrap">
      <IconC size={14} /> {label}
    </button>
  );
}
