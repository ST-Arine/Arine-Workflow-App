import { C, sans } from "../theme";

const BAR_COUNT = 14;

// Small, quiet bars; the middle ones are a touch taller. Uneven durations keep them from moving in lockstep.
const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
  const x = (i - (BAR_COUNT - 1) / 2) / (BAR_COUNT / 2);
  const envelope = Math.exp(-x * x * 2);
  return {
    height: 5 + Math.round(7 * envelope),
    duration: 1.8 + ((i * 37) % 11) / 8,            // 1.8s–3.1s
    delay: -(((i * 53) % 17) / 6),                   // negative: already mid-motion on first paint
  };
});

// Subtle "listening" indicator for the live call. Drifts gently while the line is open; still when muted or on hold.
export function ListeningWave({ muted = false, onHold = false }) {
  const active = !muted && !onHold;
  const label = onHold ? "On hold" : muted ? "Muted" : "Listening";
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-2 mb-3" style={{ height: 14 }}>
      <div className="flex items-center gap-[2px]" style={{ height: 12 }} aria-hidden="true">
        {bars.map((b, i) => (
          <span
            key={i}
            className="listen-bar"
            style={{
              width: 2, height: b.height, borderRadius: 2, background: C.inkMuted,
              transformOrigin: "center", transform: active ? undefined : "scaleY(0.4)",
              opacity: active ? 0.45 : 0.2, transition: "opacity 0.4s ease, transform 0.4s ease",
              animation: active ? `listenWave ${b.duration}s ease-in-out ${b.delay}s infinite` : "none",
            }}
          />
        ))}
      </div>
      <span style={{ ...sans, color: C.inkFaint }} className="text-[11px]">{label}</span>
    </div>
  );
}
