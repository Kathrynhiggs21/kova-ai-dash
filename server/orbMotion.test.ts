import { describe, expect, it } from "vitest";
import { KOVA_ORB_IMAGE, KOVA_ORB_VOICE_STATES } from "../client/src/components/KovaOrb";

describe("Kova orb motion contract", () => {
  it("uses the generated reflective-wave asset", () => {
    expect(KOVA_ORB_IMAGE).toBe("/manus-storage/kova-orb-reflective-particles_e2c65949.png");
  });

  it("supports the complete voice motion state set", () => {
    expect(KOVA_ORB_VOICE_STATES).toEqual(["idle", "listening", "processing", "speaking"]);
  });
});
