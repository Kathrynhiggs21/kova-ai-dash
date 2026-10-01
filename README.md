# KOVA Dashboard Donor

This repository preserves legacy React dashboard code as a **disabled migration source**. The canonical authenticated KOVA web application, including `/dashboard`, is [Kathrynhiggs21/kovaos-site](https://github.com/Kathrynhiggs21/kovaos-site) for `kovaos.com`.

The canonical orchestration hub and repository registry are [Kathrynhiggs21/Kova-ai-SYSTEM](https://github.com/Kathrynhiggs21/Kova-ai-SYSTEM). `kova_repos_config.json` governs promotion and runtime enablement. Do not deploy this donor as a parallel KOVA application.

## Development checks

Use the package-manager version pinned in `package.json`:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm check
corepack pnpm test
corepack pnpm build
```

The CI workflow checks this donor's types, tests, and build. Passing those checks does not establish production deployment or provider connectivity.

## Migration and security

Preserve useful source and history. Transfer features through reviewed changes to `kovaos-site`, rather than maintaining two dashboards. `docs/authentication.md` describes the legacy donor implementation and is not the canonical web deployment guide.

Keep credentials in server-side environment variables. Never expose signing secrets, database credentials, provider tokens, or API keys through browser code or `VITE_` variables. Follow `AGENTS.md` for one-home-per-artifact, accessibility, and owner approval boundaries.
