import { CheckCircle2 } from "../components/icons";
import { PrimaryButton } from "../components/ui";
import { HeroScreen } from "../components/HeroScreen";

export function BreakScreen({ onReturn }) {
  return (
    <HeroScreen title="Go recharge ☕" subtitle="We'll route around you. Come back whenever.">
      <PrimaryButton onClick={onReturn} icon={CheckCircle2}>I'm back</PrimaryButton>
    </HeroScreen>
  );
}
