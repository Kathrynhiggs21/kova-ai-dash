import { describe, expect, it } from "vitest";
import {
  decodeOAuthState,
  encodeOAuthState,
  sanitizeOAuthReturnPath,
} from "../shared/const";

describe("OAuth return path", () => {
  it("round-trips the requested protected URL through OAuth state", () => {
    const state = decodeOAuthState(
      encodeOAuthState({
        redirectUri: "https://kova.example/api/oauth/callback",
        nonce: "nonce",
        returnTo: "/command-center?tab=integrations",
      })
    );

    expect(state.returnTo).toBe("/command-center?tab=integrations");
    expect(sanitizeOAuthReturnPath(state.returnTo)).toBe(
      "/command-center?tab=integrations"
    );
  });

  it.each([
    "https://attacker.example/path",
    "//attacker.example/path",
    "/\\\\attacker.example/path",
    "/%2f%2fattacker.example/path",
    "/%5c%5cattacker.example/path",
    "/%0d%0aLocation:%20https://attacker.example",
  ])("rejects unsafe return target %s", target => {
    expect(sanitizeOAuthReturnPath(target)).toBe("/");
  });

  it("falls back when no return target was recorded", () => {
    expect(sanitizeOAuthReturnPath()).toBe("/");
    expect(sanitizeOAuthReturnPath({ path: "/command-center" })).toBe("/");
  });
});
