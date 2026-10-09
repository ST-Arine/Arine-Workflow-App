import { C, sans } from "../theme";

const BAR_COUNT = 30;

// Soft bell-shaped envelope so the middle bars swing the highest, like a live audio waveform.
const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
  const x = (i - (BAR_COUNT - 1) / 2) / (BAR_COUNT / 2);
  const envelope = Math.exp(-x * x * 2.2);
  return {
    height: 6 + Math.round(26 * envelope),
    duration: 0.9 + ((i * 37) % 11) / 10,           // 0.9s–1.9s, uneven so bars drift in and out of phase
    delay: -(((i * 53) % 17) / 10),                  // negative: already mid-motion on first paint
    color: i < BAR_COUNT / 2 ? C.primary : C.green,
  };
});

// "Listening" indicator for the live call. Animates while the line is open; goes still when muted or on hold.
export function ListeningWave({ muted = false, onHold = false }) {
  const active = !muted && !onHold;
  const label = onHold ? "On hold" : muted ? "Muted" : "Listening for notes";
  return (
    <div role="status" aria-live="polite" className="mt-4 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-center gap-[3px]" style={{ height: 34, position: "relative" }}>
        {active && (
          <div
            aria-hidden="true"
            style={{ position: "absolute", inset: "4px 12%", borderRadius: 999, background: "linear-gradient(90deg, #FF5DA2, #FF9A4D, #36E2C8)", opacity: 0.18, filter: "blur(14px)", animation: "listenGlow 3.2s ease-in-out infinite" }}
          />
        )}
        {bars.map((b, i) => (
          <span
            key={i}
            className="listen-bar"
            style={{
              position: "relative", width: 3, height: b.height, borderRadius: 3,
              background: `linear-gradient(180deg, ${b.color}, #FF9A4D)`,
              transformOrigin: "center", transform: active ? undefined : "scaleY(0.18)",
              opacity: active ? 1 : 0.35, transition: "opacity 0.4s ease, transform 0.4s ease",
              animation: active ? `listenWave ${b.duration}s ease-in-out ${b.delay}s infinite` : "none",
            }}
          />
        ))}
      </div>
      <div style={{ ...sans, color: active ? C.inkMuted : C.inkFaint }} className="text-xs mt-2 flex items-center justify-center gap-1.5">
        <span
          aria-hidden="true"
          style={{ width: 6, height: 6, borderRadius: "50%", background: active ? C.green : C.inkFaint, animation: active ? "softPulse 1.8s ease-in-out infinite" : "none" }}
        />
        {label}
      </div>
    </div>
  );
}
