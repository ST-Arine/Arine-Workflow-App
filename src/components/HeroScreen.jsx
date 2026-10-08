import { C, serif, sans } from "../theme";

// Shared layout for the simple "status" pages (Ready, On break) so heading, subtext and buttons always land in the same spot.
export function HeroScreen({ title, subtitle, children }) {
  return (
    <div className="rise-in" style={{ marginTop: 80 }}>
      <h1 style={{ ...serif, color: C.ink, letterSpacing: "-0.01em" }} className="text-5xl mb-3">{title}</h1>
      <p style={{ ...sans, color: C.inkMuted }} className="text-base mb-8">{subtitle}</p>
      <div className="flex items-center flex-wrap gap-3">{children}</div>
    </div>
  );
}
