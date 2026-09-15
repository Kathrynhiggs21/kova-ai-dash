# KOVA OS Dashboard

React dashboard and integration hub for KOVA OS.

## Scope

This repository owns dashboard UI, user-facing integration state, authenticated API access, persistence, and file-storage UI. It does not own the overall KOVA architecture. Canonical repository roles live in [Kathrynhiggs21/Kova-ai-SYSTEM](https://github.com/Kathrynhiggs21/Kova-ai-SYSTEM).

Authentication components and token handling are documented in [docs/authentication.md](docs/authentication.md).

## Development

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm check
corepack pnpm test
corepack pnpm build
corepack pnpm dev
```

Use the package-manager version pinned in `package.json`.

## Production boundary

The intended public route is `https://kovaos.com/dashboard`. Secrets belong in the deployment environment. Never expose `JWT_SECRET`, database credentials, provider tokens, or API keys through `VITE_` variables or browser code.

## Status

Enabled in the KOVA runtime registry as the current dashboard candidate. Consolidation with `kovaos-site` must happen through an explicit, tested migration rather than maintaining two competing dashboards.
