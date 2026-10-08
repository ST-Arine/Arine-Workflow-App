import { useState, useEffect } from "react";
import { C, sans } from "../theme";
import { LOADER_LINES } from "../data/mock";

// ---------- LOADER ----------
export function LoaderScreen() {
  const [lineIdx, setLineIdx] = useState(0);
  useEffect(() => {
    if (lineIdx >= LOADER_LINES.length - 1) return;
    const t = setTimeout(() => setLineIdx((i) => i + 1), 700);
    return () => clearTimeout(t);
  }, [lineIdx]);
  return (
    <div className="flex flex-col items-center py-16 rise-in">
      <div className="flex items-end gap-1.5 mb-6" style={{ height: 40 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            width: 6, height: 40, borderRadius: 4,
            background: "linear-gradient(180deg, #FF5DA2, #FF9A4D)",
            animation: `barBounce ${0.5 + i * 0.09}s ease-in-out infinite`,
            animationDelay: `${i * 0.08}s`,
          }} />
        ))}
      </div>
      <p key={lineIdx} style={{ ...sans, color: C.inkMuted }} className="fade-in text-sm">{LOADER_LINES[lineIdx]}</p>
    </div>
  );
}
