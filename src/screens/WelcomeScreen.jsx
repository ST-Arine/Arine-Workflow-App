import { C, serif, sans } from "../theme";
import { Coffee, ChevronRight } from "../components/icons";
import { PrimaryButton, GhostButton } from "../components/ui";

// ---------- WELCOME ----------
export function WelcomeScreen({ completedCount, onFind, onBreak }) {
  const returning = completedCount > 0;
  return (
    <div className="rise-in" style={{ marginTop: 80 }}>
      <h1 style={{ ...serif, color: C.ink, letterSpacing: "-0.01em" }} className="text-5xl mb-3">
        {returning ? `You're on a roll 🔥` : `Ready when you are ✨`}
      </h1>
      <p style={{ ...sans, color: C.inkMuted }} className="text-base mb-8">
        {returning ? `${completedCount} down today. Keep going, or grab a breather?` : "Let's find your next call."}
      </p>
      <div className="flex items-center flex-wrap gap-3">
        <PrimaryButton onClick={onFind} icon={ChevronRight}>Find my next call</PrimaryButton>
        <GhostButton onClick={onBreak}><Coffee size={13} /> Take 5</GhostButton>
      </div>
    </div>
  );
}
