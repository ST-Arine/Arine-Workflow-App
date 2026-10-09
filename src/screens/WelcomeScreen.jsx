import { ChevronRight } from "../components/icons";
import { PrimaryButton, GhostButton } from "../components/ui";
import { HeroScreen } from "../components/HeroScreen";

// ---------- WELCOME ----------
export function WelcomeScreen({ completedCount, onFind, onBreak }) {
  const returning = completedCount > 0;
  return (
    <HeroScreen
      title={returning ? `You're on a roll 🔥` : `Ready when you are ✨`}
      subtitle={returning ? `${completedCount} down today. Keep going, or grab a breather?` : "Let's find your next call."}
    >
      <GhostButton large onClick={onBreak}>Take a Break</GhostButton>
      <PrimaryButton onClick={onFind} icon={ChevronRight} iconRight>Find my next call</PrimaryButton>
    </HeroScreen>
  );
}
