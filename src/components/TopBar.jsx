import { C, serif, sans } from "../theme";
import { Flame } from "./icons";
import { AccountSwitcher, ProfileMenu } from "./menus";

// ---------- top bar ----------
export function TopBar({ completedCount, account, setAccount, status, onGoBreak, onBackFromBreak, role, onToggleRole }) {
  return (
    <div
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 45, background: "rgba(25,15,51,0.7)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: `1px solid ${C.border}` }}
      className="flex items-center justify-between px-4 sm:px-6 py-3"
    >
      <div className="flex items-center gap-3">
        <ProfileMenu name="Dana R." status={status} onGoBreak={onGoBreak} onBackFromBreak={onBackFromBreak} role={role} onToggleRole={onToggleRole} />
        <span style={{ ...serif, color: C.ink, fontWeight: 600 }} className="text-lg">Hey, Dana 👋</span>
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
