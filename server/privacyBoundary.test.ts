import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const clientRoot = path.join(projectRoot, "client", "src");

function readSourceTree(directory: string): string {
  return readdirSync(directory)
    .flatMap(entry => {
      const fullPath = path.join(directory, entry);
      if (statSync(fullPath).isDirectory()) return readSourceTree(fullPath);
      return /\.(ts|tsx)$/.test(entry) ? readFileSync(fullPath, "utf8") : "";
    })
    .join("\n");
}

describe("private command-center boundary", () => {
  it("routes the command center through the existing authenticated guard", () => {
    const appSource = readFileSync(path.join(clientRoot, "App.tsx"), "utf8");

    expect(appSource).toContain("<ProtectedRoute>");
    expect(appSource).toContain(
      '<Route path={"/command-center"} component={ProtectedCommandCenter} />'
    );
  });

  it("keeps personalized deep links and family mappings out of client source", () => {
    const source = readSourceTree(clientRoot);

    expect(source).not.toMatch(
      /drive\.google\.com\/drive\/folders\/[A-Za-z0-9_-]+/
    );
    expect(source).not.toMatch(
      /(?:notion\.so\/|app\.notion\.com\/p\/)[A-Za-z0-9_-]{20,}/
    );
    expect(source).not.toMatch(/manage\.wix\.com\/dashboard\/[A-Za-z0-9_-]+/);
    expect(source).not.toMatch(
      /mcp\.zapier\.com\/mcp\/servers\/[A-Za-z0-9_-]+/
    );
  });
});
