import { useState } from "react";
import { C, serif, sans } from "../theme";
import { Menu } from "./icons";
import { ProfileMenu } from "./menus";

const NAV_COLLAPSED = 68;
const NAV_EXPANDED = 232;

function NavButton({ item, active, expanded, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => onSelect(item.id)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      title={expanded ? undefined : item.label} aria-label={item.label} aria-current={active ? "page" : undefined}
      style={{
        ...sans, height: 40, background: active ? C.primarySoft : hover ? "rgba(255,255,255,0.08)" : "transparent",
        color: active ? C.primary : C.inkMuted, fontWeight: active ? 700 : 500, whiteSpace: "nowrap",
      }}
      className="text-sm flex items-center gap-3 px-3 rounded-xl text-left w-full"
    >
      <span style={{ width: 20, display: "flex", justifyContent: "center", flexShrink: 0 }}><item.icon size={18} /></span>
      {expanded && <span>{item.label}</span>}
    </button>
  );
}

export function SideNav({ items, activeId, onSelect, expanded, onToggle, profileProps }) {
  return (
    <nav
      aria-label="Main"
      style={{
        position: "sticky", top: 0, height: "100vh", flexShrink: 0, zIndex: 46, overflow: "hidden",
        width: expanded ? NAV_EXPANDED : NAV_COLLAPSED, transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        padding: 12, display: "flex", flexDirection: "column",
      }}
    >
      {/* Glass lives on its own layer: backdrop-filter on the nav itself would trap the profile menu (position: fixed) inside it */}
      <div className="glass" style={{ position: "absolute", inset: 0, zIndex: -1, borderWidth: "0 1px 0 0", borderRadius: 0, pointerEvents: "none" }} />
      <button
        onClick={onToggle} aria-label={expanded ? "Collapse navigation" : "Expand navigation"} aria-expanded={expanded}
        style={{ height: 40, color: C.inkMuted }} className="flex items-center gap-3 px-3 rounded-xl w-full mb-3 hover:bg-white/10"
      >
        <span style={{ width: 20, display: "flex", justifyContent: "center", flexShrink: 0 }}><Menu size={18} /></span>
        {expanded && <span style={{ ...serif, color: C.ink, whiteSpace: "nowrap" }} className="text-base">Workflow</span>}
      </button>

      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <NavButton key={item.id} item={item} active={item.id === activeId} expanded={expanded} onSelect={onSelect} />
        ))}
      </div>

      <div style={{ marginTop: "auto", position: "relative", borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
        <ProfileMenu {...profileProps} expanded={expanded} />
      </div>
    </nav>
  );
}

// Page frame: left nav pushes the content column to the right instead of floating over it.
export function AppShell({ navItems, activeId, onSelect, profileProps, background, children }) {
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem("navExpanded");
    return saved === null ? window.innerWidth >= 1024 : saved === "true";
  });
  const toggle = () => setExpanded((e) => { localStorage.setItem("navExpanded", String(!e)); return !e; });

  return (
    // overflow: clip (not hidden) keeps the blobs contained without breaking the sticky nav and top bar
    <div style={{ background: C.bg, minHeight: "100vh", position: "relative", overflow: "clip" }}>
      {background}
      <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
        <SideNav items={navItems} activeId={activeId} onSelect={onSelect} expanded={expanded} onToggle={toggle} profileProps={profileProps} />
        <div style={{ flex: 1, minWidth: 0, position: "relative" }}>{children}</div>
      </div>
    </div>
  );
}
