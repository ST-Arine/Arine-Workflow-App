import { C, serif, sans } from "../theme";
import { Flame } from "./icons";
import { AccountSwitcher } from "./menus";

// ---------- top bar ----------
export function TopBar({ userName, completedCount, account, setAccount }) {
  return (
    <div
      style={{ position: "sticky", top: 0, zIndex: 45, background: "rgba(25,15,51,0.7)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: `1px solid ${C.border}` }}
      className="flex items-center justify-between px-4 sm:px-6 py-3"
    >
      <div className="flex items-center gap-3">
        <span style={{ ...serif, color: C.ink, fontWeight: 600 }} className="text-lg">Hey, {userName} 👋</span>
      </div>
      <div className="flex items-center gap-4">
        {completedCount > 0 && (
          <span style={{ ...sans, color: C.amber }} className="text-xs font-bold flex items-center gap-1">
            <Flame size={14} /> {completedCount} streak
          </span>
        )}
        <span style={{ width: 1, height: 20, background: C.border }} />
        <AccountSwitcher account={account} setAccount={setAccount} />
      </div>
    </div>
  );
}
