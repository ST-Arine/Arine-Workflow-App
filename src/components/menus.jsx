import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { C, serif, sans } from "../theme";
import { Check, Building, Settings, LogOut, User } from "./icons";
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

// Generic, reusable dropdown. The panel is rendered in a portal on <body>, so it is positioned against the viewport
// no matter where the trigger lives (cards use backdrop-filter, which would otherwise trap position: fixed children).
// It measures itself and the trigger on open, then: aligns to the trigger (align: "left" | "right"), opens below by
// default but flips above when there isn't room, and is clamped inside the viewport.
// placement "side" opens beside the trigger and grows upward (for triggers pinned to the bottom-left corner).
export function Dropdown({ trigger, panelWidth = 220, placement = "below", align = "left", fullWidth = false, children }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const [pos, setPos] = useState(null);

  function place() {
    if (!triggerRef.current || !panelRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const w = panelRef.current.offsetWidth, h = panelRef.current.offsetHeight;
    const margin = 12, gap = 8, vw = window.innerWidth, vh = window.innerHeight;
    let left, top;
    if (placement === "side") {
      left = rect.right + gap;
      if (left + w > vw - margin) left = rect.left - gap - w;
      top = rect.bottom - h;
    } else {
      left = align === "right" ? rect.right - w : rect.left;
      const roomBelow = vh - rect.bottom - gap - margin;
      const roomAbove = rect.top - gap - margin;
      top = h <= roomBelow || roomBelow >= roomAbove ? rect.bottom + gap : rect.top - gap - h;
    }
    left = Math.min(Math.max(left, margin), Math.max(margin, vw - w - margin));
    top = Math.min(Math.max(top, margin), Math.max(margin, vh - h - margin));
    setPos({ top, left });
  }

  // Measure after the panel mounts (still hidden) and before it paints, so it never flashes in the wrong spot.
  useLayoutEffect(() => {
    if (open) place(); else setPos(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onMouseDown = (e) => {
      if (wrapperRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return;
      close();
    };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true); // capture: also fires for scrolling containers
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} style={{ display: fullWidth ? "block" : "inline-block" }}>
      <span ref={triggerRef} style={{ display: fullWidth ? "block" : "inline-block" }}>
        {trigger({ open, toggle: () => setOpen((o) => !o) })}
      </span>
      {open && createPortal(
        <div
          ref={panelRef} className="fade-in" onClick={() => setOpen(false)}
          style={{ ...dropdownPanelStyle, minWidth: panelWidth, top: pos ? pos.top : 0, left: pos ? pos.left : 0, visibility: pos ? "visible" : "hidden" }}
        >
          {children}
        </div>,
        document.body
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

export function ProfileMenu({ name, status, onGoBreak, onBackFromBreak, onPreferences, onLogout, users = [], activeUserId, onSelectUser, expanded = false }) {
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
        {users.length > 0 && (
          <>
            <div style={{ borderTop: `1px solid ${C.border}` }} className="my-1" />
            <div style={{ ...sans, color: C.inkFaint }} className="text-xs px-3 py-1 uppercase tracking-wide">Switch user</div>
            {users.map((u) => (
              <DropdownItem key={u.id} icon={u.id === activeUserId ? Check : User} onClick={() => onSelectUser(u.id)}>
                <span style={{ color: u.id === activeUserId ? C.primary : "#FFFFFF" }}>{u.label}</span>
              </DropdownItem>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }} className="my-1" />
          </>
        )}
        <DropdownItem icon={LogOut} tone="danger" onClick={onLogout}>Log out</DropdownItem>
      </>
    </Dropdown>
  );
}
