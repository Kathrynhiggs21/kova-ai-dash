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

    expect(appSource).toMatch(/<ProtectedRoute\s*>/);
    const commandCenterRoute = appSource.match(
      /<Route\b[^>]*path=\{?["']\/command-center["']\}?[^>]*\/>/
    )?.[0];
    expect(commandCenterRoute).toMatch(
      /component=\{\s*ProtectedCommandCenter\s*\}/
    );
  });

  it("protects every operational route before rendering private tools", () => {
    const appSource = readFileSync(path.join(clientRoot, "App.tsx"), "utf8");
    const routeComponents = new Map(
      Array.from(
        appSource.matchAll(
          /<Route\b[^>]*path=\{?["']([^"']+)["']\}?[^>]*component=\{\s*([^}\s]+)\s*\}[^>]*\/>/g
        ),
        match => [match[1], match[2]]
      )
    );

    expect(routeComponents.get("/")).toBe("ProtectedHome");
    expect(routeComponents.get("/command-center")).toBe(
      "ProtectedCommandCenter"
    );
    expect(routeComponents.get("/commands")).toBe("ProtectedCommands");
    expect(routeComponents.get("/storage")).toBe("ProtectedStorageVault");
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
    expect(source).not.toMatch(/\b15 Kova worlds\b/i);
    expect(source).not.toMatch(/\b14 sites detected\b/i);
  });

  it("uses the generic Zapier entry point without promising a deep link", () => {
    const source = [
      readFileSync(
        path.join(projectRoot, "shared", "defaultIntegrations.ts"),
        "utf8"
      ),
      readFileSync(path.join(clientRoot, "pages", "Home.tsx"), "utf8"),
    ].join("\n");

    expect(source).toContain('actionUrl: "https://mcp.zapier.com"');
    expect(source).not.toMatch(/open your Zapier MCP settings/i);
  });
});
