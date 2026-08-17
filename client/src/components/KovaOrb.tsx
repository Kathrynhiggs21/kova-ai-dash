import type { CSSProperties } from "react";

export type KovaOrbVoiceState = "idle" | "listening" | "processing" | "speaking";

export const KOVA_ORB_VOICE_STATES: KovaOrbVoiceState[] = ["idle", "listening", "processing", "speaking"];

export const KOVA_ORB_IMAGE = "/manus-storage/kova-orb-reflective-particles_e2c65949.png";

const STATE_LABELS: Record<KovaOrbVoiceState, string> = {
  idle: "Kova orb idle",
  listening: "Kova orb listening",
  processing: "Kova orb processing",
  speaking: "Kova orb speaking",
};

interface KovaOrbProps {
  voiceState?: KovaOrbVoiceState;
  size?: "hero" | "compact";
  className?: string;
}

const PARTICLES = Array.from({ length: 14 }, (_, index) => ({
  index,
  angle: `${index * 25.7}deg`,
  distance: `${112 + (index % 3) * 14}px`,
  delay: `${(index % 5) * 0.42}s`,
  size: `${2 + (index % 3)}px`,
}));

export function KovaOrb({ voiceState = "idle", size = "hero", className = "" }: KovaOrbProps) {
  return (
    <div
      className={`kova-orb kova-orb--${size} kova-orb--${voiceState} ${className}`}
      data-voice-state={voiceState}
      role="img"
      aria-label={STATE_LABELS[voiceState]}
    >
      <div className="kova-orb__halo" aria-hidden="true" />
      <div className="kova-orb__particles" aria-hidden="true">
        {PARTICLES.map(particle => (
          <span
            key={particle.index}
            className="kova-orb__particle"
            style={
              {
                "--particle-angle": particle.angle,
                "--particle-distance": particle.distance,
                "--particle-delay": particle.delay,
                "--particle-size": particle.size,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="kova-orb__core">
        <img src={KOVA_ORB_IMAGE} alt="" className="kova-orb__image" />
      </div>
      <div className="kova-orb__surface" aria-hidden="true" />
      <div className="kova-orb__ripple kova-orb__ripple--one" aria-hidden="true" />
      <div className="kova-orb__ripple kova-orb__ripple--two" aria-hidden="true" />
    </div>
  );
}
