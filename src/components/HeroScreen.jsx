import { Children } from "react";
import { C, serif, sans } from "../theme";

// Shared layout for the simple "status" pages (Ready, On break) so heading, subtext and buttons always land in the same spot.
// Button convention: secondary on the left, primary on the right (a lone primary goes right).
export function HeroScreen({ title, subtitle, children }) {
  return (
    <div className="rise-in" style={{ marginTop: 80 }}>
      <h1 style={{ ...serif, color: C.ink, letterSpacing: "-0.01em" }} className="text-5xl mb-3">{title}</h1>
      <p style={{ ...sans, color: C.inkMuted }} className="text-base mb-8">{subtitle}</p>
      <div className={`flex items-center flex-wrap gap-3 ${Children.count(children) > 1 ? "justify-between" : "justify-end"}`}>{children}</div>
    </div>
  );
}
