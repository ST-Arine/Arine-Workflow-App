import { useState, useEffect, useRef } from "react";
import { C, serif, sans } from "../theme";
import { Check, Building, Settings, LogOut, Users } from "./icons";
import { ACCOUNTS } from "../data/mock";

// ---------- dropdown helpers ----------
export function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) onOutside(); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}
export const dropdownPanelStyle = {
  position: "fixed", minWidth: 220,
  background: "#241a44", border: `1px solid ${C.border}`, borderRadius: 14,
  backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
  boxShadow: "0 20px 44px -16px rgba(0,0,0,0.5)", zIndex: 50, padding: 6,
};

// Generic, reusable dropdown: measures the trigger's position on open and
// flips left/right alignment automatically so the panel never runs off-screen,
// regardless of where in the layout it's mounted.
export function Dropdown({ trigger, panelWidth = 220, placement = "below", fullWidth = false, children }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const [pos, setPos] = useState(null);
  useClickOutside(wrapperRef, () => setOpen(false));

  function computePos() {
    if (!triggerRef.current) return { top: 0, left: 0 };
    const rect = triggerRef.current.getBoundingClientRect();
    const margin = 12;
    // "side": open to the right of the trigger, growing upward (for triggers pinned to the bottom-left corner)
    if (placement === "side") return { bottom: window.innerHeight - rect.bottom, left: rect.right + 8 };
    let left = rect.left;
    if (left + panelWidth > window.innerWidth - margin) left = rect.right - panelWidth;
    if (left < margin) left = margin;
    return { top: rect.bottom + 8, left };
  }

  function toggle() {
    if (open) { setOpen(false); return; }
    setPos(computePos()); // measure before showing, so it never flashes at the wrong spot
    setOpen(true);
  }

  return (
    <div ref={wrapperRef} style={{ display: fullWidth ? "block" : "inline-block" }}>
      <span ref={triggerRef} style={{ display: fullWidth ? "block" : "inline-block" }}>
        {trigger({ open, toggle })}
      </span>
      {open && pos && (
        <div className="fade-in" style={{ ...dropdownPanelStyle, top: pos.top, bottom: pos.bottom, left: pos.left, minWidth: panelWidth }} onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ onClick, icon: IconC, tone = "default", children }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...sans, color: tone === "danger" ? C.danger : "#FFFFFF", background: hover ? "rgba(255,255,255,0.08)" : "transparent" }}
      className="w-full text-left text-sm px-3 py-2 rounded-xl flex items-center gap-2 font-medium"
    >
      {IconC && <IconC size={14} />}{children}
    </button>
  );
}

export function AccountSwitcher({ account, setAccount }) {
  const [hover, setHover] = useState(false);
  return (
    <Dropdown
      panelWidth={220}
      trigger={({ open, toggle }) => (
        <button
          onClick={toggle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
          style={{ ...sans, color: C.inkMuted, background: hover || open ? "rgba(255,255,255,0.1)" : "transparent" }}
          className="text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
        >
          <Building size={13} /> <span className="hidden sm:inline max-w-[140px] truncate">{account}</span>
        </button>
      )}
    >
      <div style={{ ...sans, color: C.inkFaint }} className="text-xs px-3 py-1.5 uppercase tracking-wide">Switch account</div>
      {ACCOUNTS.map((a) => (
        <DropdownItem key={a} onClick={() => setAccount(a)} icon={a === account ? Check : undefined}>
          <span style={{ color: a === account ? C.primary : "#FFFFFF" }}>{a}</span>
        </DropdownItem>
      ))}
    </Dropdown>
  );
}

export const STATUS_MAP = {
  available: { label: "Available", color: C.green },
  on_call: { label: "On a call", color: C.primary },
  break: { label: "On break", color: C.amber },
};

export function ProfileMenu({ name, status, onGoBreak, onBackFromBreak, onPreferences, onLogout, role, onToggleRole, expanded = false }) {
  const [hover, setHover] = useState(false);
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const s = STATUS_MAP[status];
  return (
    <Dropdown
      panelWidth={220}
      placement="side"
      fullWidth
      trigger={({ open, toggle }) => (
        <button
          onClick={toggle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
          aria-label="Profile menu"
          style={{ background: hover || open ? "rgba(255,255,255,0.1)" : "transparent", border: "none", padding: 8, ...sans }}
          className={`flex items-center gap-3 w-full ${expanded ? "rounded-xl text-left" : "rounded-xl justify-center"}`}
        >
          <div style={{ position: "relative", width: 28, height: 28 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #FF5DA2, #8B7CF6)", color: "#1B0F2E", ...serif, fontWeight: 600 }} className="flex items-center justify-center text-xs">
              {initials}
            </div>
            <span
              style={{
                position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: "50%",
                background: C.bg, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <span
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: status === "break" ? "transparent" : s.color,
                  border: status === "break" ? `2px solid ${s.color}` : "none",
                  animation: status === "on_call" ? "softPulse 1.8s ease-in-out infinite" : "none",
                  transition: "background-color 0.3s ease, border-color 0.3s ease",
                }}
              />
            </span>
          </div>
          {expanded && (
            <span style={{ minWidth: 0 }} className="flex flex-col">
              <span style={{ color: C.ink, whiteSpace: "nowrap" }} className="text-sm font-semibold">{name}</span>
              <span style={{ color: s.color, whiteSpace: "nowrap" }} className="text-xs">{s.label}</span>
            </span>
          )}
        </button>
      )}
    >
      <>
        <div style={{ ...sans, color: "#FFFFFF" }} className="text-sm font-semibold px-3 py-2">{name}</div>
        <div style={{ borderTop: `1px solid ${C.border}` }} className="my-1" />
        <div style={{ ...sans, color: C.inkFaint }} className="text-xs px-3 py-1 uppercase tracking-wide">Status</div>
        {status === "on_call" ? (
          <div style={{ ...sans, color: C.inkMuted }} className="text-sm px-3 py-2 flex items-center gap-2">
            <span style={{ background: s.color, width: 6, height: 6, borderRadius: "50%" }} /> On a call — can't change right now
          </div>
        ) : (
          <>
            <DropdownItem onClick={onBackFromBreak}>
              <span style={{ background: C.green, width: 6, height: 6, borderRadius: "50%", display: "inline-block" }} />
              <span style={{ color: status === "available" ? C.primary : "#FFFFFF" }}>Available</span>
              {status === "available" && <Check size={13} style={{ marginLeft: "auto" }} color={C.green} />}
            </DropdownItem>
            <DropdownItem onClick={onGoBreak}>
              <span style={{ background: "transparent", border: `1.5px solid ${C.amber}`, width: 6, height: 6, borderRadius: "50%", display: "inline-block" }} />
              <span style={{ color: status === "break" ? C.primary : "#FFFFFF" }}>On break</span>
              {status === "break" && <Check size={13} style={{ marginLeft: "auto" }} color={C.green} />}
            </DropdownItem>
          </>
        )}
        <div style={{ borderTop: `1px solid ${C.border}` }} className="my-1" />
        <DropdownItem icon={Settings} onClick={onPreferences}>Preferences</DropdownItem>
        {onToggleRole && (
          <DropdownItem icon={Users} onClick={onToggleRole}>
            Switch to {role === "manager" ? "caller" : "manager"} view
          </DropdownItem>
        )}
        <DropdownItem icon={LogOut} tone="danger" onClick={onLogout}>Log out</DropdownItem>
      </>
    </Dropdown>
  );
}
