import { useState } from "react";
import { C, serif, sans } from "../theme";
import { Check, X, Plus } from "../components/icons";
import { ACCOUNTS, PHARMACISTS, NAV_ITEMS, MOCK_AGENTS, PRIORITY_RULES, INTEGRATIONS } from "../data/mock";
import { Badge, Panel, GhostButton } from "../components/ui";
import { AccountSwitcher, STATUS_MAP } from "../components/menus";
import { AppShell } from "../components/SideNav";

// ---------- APP ----------
// ---------- manager admin shell ----------
export function AdminOverview() {
  const online = MOCK_AGENTS.filter((a) => a.status !== "break").length;
  const totalCalls = MOCK_AGENTS.reduce((sum, a) => sum + a.callsToday, 0);
  const stats = [
    { label: "Agents online", value: online },
    { label: "Calls today", value: totalCalls },
    { label: "Avg handle time", value: "6m 42s" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <Panel key={s.label}>
          <div style={{ ...serif, color: C.ink }} className="text-3xl mb-1">{s.value}</div>
          <div style={{ ...sans, color: C.inkMuted }} className="text-xs uppercase tracking-wide">{s.label}</div>
        </Panel>
      ))}
    </div>
  );
}

export function AdminAgents() {
  return (
    <Panel>
      <div className="flex flex-col gap-3">
        {MOCK_AGENTS.map((a) => {
          const s = STATUS_MAP[a.status];
          return (
            <div key={a.name} style={{ borderColor: C.border }} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
              <span style={{ ...sans, color: C.ink }} className="text-sm font-semibold">{a.name}</span>
              <div className="flex items-center gap-3">
                <span style={{ ...sans, color: C.inkFaint }} className="text-xs">{a.callsToday} calls today</span>
                <Badge tone={a.status === "available" ? "green" : a.status === "on_call" ? "primary" : "amber"}>{s.label}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export function AdminPriority() {
  return (
    <Panel>
      <div style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium mb-3 uppercase tracking-wide">Scoring factors</div>
      <div className="flex flex-col gap-2 mb-4">
        {PRIORITY_RULES.map((r) => (
          <div key={r.label} style={{ borderColor: C.border }} className="flex items-center justify-between border rounded-xl p-3">
            <span style={{ ...sans, color: C.ink }} className="text-sm">{r.label}</span>
            <Badge tone="primary">{r.weight}</Badge>
          </div>
        ))}
      </div>
      <GhostButton onClick={() => {}}><Plus size={13} /> Add rule</GhostButton>
    </Panel>
  );
}

export function AdminQuickConnects() {
  return (
    <Panel>
      <div style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium mb-3 uppercase tracking-wide">Warm transfer destinations</div>
      <div className="flex flex-col gap-2 mb-4">
        {PHARMACISTS.map((p) => (
          <div key={p.name} style={{ borderColor: C.border }} className="flex items-center justify-between border rounded-xl p-3">
            <span style={{ ...sans, color: C.ink }} className="text-sm">{p.name}</span>
            <div className="flex items-center gap-2">
              <Badge tone={p.status === "available" ? "green" : "muted"}>{p.status === "available" ? "Available" : `Busy · ${p.wait}`}</Badge>
              <GhostButton onClick={() => {}}>Edit</GhostButton>
            </div>
          </div>
        ))}
      </div>
      <GhostButton onClick={() => {}}><Plus size={13} /> Add quick connect</GhostButton>
    </Panel>
  );
}

export function AdminIntegrations() {
  return (
    <div className="flex flex-col gap-3">
      {INTEGRATIONS.map((i) => (
        <Panel key={i.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div style={{ ...sans, color: C.ink }} className="text-sm font-semibold mb-0.5">{i.name}</div>
            <div style={{ ...sans, color: C.inkMuted }} className="text-xs">{i.desc}</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={i.status === "connected" ? "green" : "muted"}>{i.status === "connected" ? "Connected" : "Not connected"}</Badge>
            <GhostButton onClick={() => {}}>{i.status === "connected" ? "Configure" : "Connect"}</GhostButton>
          </div>
        </Panel>
      ))}
    </div>
  );
}

export function AdminSettings() {
  const [toggles, setToggles] = useState({ notify: true, autoAssign: true, recordCalls: false });
  const rows = [
    { key: "notify", label: "Notify agents when a high-priority engagement enters the queue" },
    { key: "autoAssign", label: "Auto-assign next engagement when an agent goes available" },
    { key: "recordCalls", label: "Record calls for QA review" },
  ];
  return (
    <Panel>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.key} style={{ borderColor: C.border }} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
            <span style={{ ...sans, color: C.ink }} className="text-sm flex-1 pr-4">{r.label}</span>
            <GhostButton onClick={() => setToggles((t) => ({ ...t, [r.key]: !t[r.key] }))}>
              {toggles[r.key] ? <Check size={13} color={C.green} /> : <X size={13} color={C.inkFaint} />} {toggles[r.key] ? "On" : "Off"}
            </GhostButton>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export const ADMIN_PAGES = {
  overview: AdminOverview, agents: AdminAgents, priority: AdminPriority,
  quickconnects: AdminQuickConnects, integrations: AdminIntegrations, settings: AdminSettings,
};

export function ManagerShell({ onToggleRole, engagements }) {
  const [adminPage, setAdminPage] = useState("overview");
  const [account, setAccount] = useState(ACCOUNTS[0]);
  const activeItem = NAV_ITEMS.find((n) => n.id === adminPage);
  const PageComponent = ADMIN_PAGES[adminPage];

  const background = (
    <>
      <div className="blob" style={{ position: "absolute", top: "-10%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "#FF5DA2", opacity: 0.25, filter: "blur(90px)", animation: "drift1 18s ease-in-out infinite" }} />
      <div className="blob" style={{ position: "absolute", bottom: "-15%", left: "-10%", width: 420, height: 420, borderRadius: "50%", background: "#36E2C8", opacity: 0.2, filter: "blur(90px)", animation: "drift3 20s ease-in-out infinite" }} />
    </>
  );

  return (
    <AppShell
      navItems={NAV_ITEMS} activeId={adminPage} onSelect={setAdminPage} background={background}
      profileProps={{ name: "Dana R.", status: "available", onGoBreak: () => {}, onBackFromBreak: () => {}, role: "manager", onToggleRole }}
    >
      <div
        style={{ position: "sticky", top: 0, zIndex: 45, background: "rgba(25,15,51,0.7)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: `1px solid ${C.border}` }}
        className="flex items-center justify-between px-4 sm:px-6 py-3"
      >
        <span style={{ ...serif, color: C.ink, fontWeight: 600 }} className="text-base">Hello, Dana 👋</span>
        <div className="flex items-center gap-4">
          <AccountSwitcher account={account} setAccount={setAccount} />
        </div>
      </div>

      {adminPage === "engagements" ? engagements : (
        <div className="relative max-w-4xl mx-auto px-4 sm:px-8 pb-10" style={{ paddingTop: 32 }}>
          <h1 style={{ ...serif, color: C.ink }} className="text-2xl mb-1">{activeItem.label}</h1>
          <p style={{ ...sans, color: C.inkMuted }} className="text-sm mb-6">Configuration for your organization's calling workflow.</p>
          <PageComponent />
        </div>
      )}
    </AppShell>
  );
}
