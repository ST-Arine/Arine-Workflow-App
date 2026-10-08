import { C, serif, sans } from "../theme";
import { CheckCircle2 } from "../components/icons";
import { PrimaryButton } from "../components/ui";

export function BreakScreen({ onReturn }) {
  return (
    <div className="rise-in">
      <h1 style={{ ...serif, color: C.ink }} className="text-4xl mb-2">Go recharge ☕</h1>
      <p style={{ ...sans, color: C.inkMuted }} className="text-base mb-8">We'll route around you. Come back whenever.</p>
      <PrimaryButton onClick={onReturn} icon={CheckCircle2}>I'm back</PrimaryButton>
    </div>
  );
}
