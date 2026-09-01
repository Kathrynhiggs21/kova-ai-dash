# KOVA OS — Component Repository Instructions

This repository contains **dashboard candidate / older dashboard work** for KOVA OS. It is not the canonical orchestration hub and must not become a second KOVA system by default.

Canonical orchestration and repository roles live in `Kathrynhiggs21/Kova-ai-SYSTEM` (`AGENTS.md` + `KOVA_REPO_MAP.md`).

Rules:
1. Treat this repo as non-canonical until its dashboard implementation is audited against the active KOVA web stack.
2. Do not deploy it as the primary KOVA dashboard unless the orchestration map records that migration.
3. Prefer consolidation with the active web implementation over parallel dashboard work.
4. Do not commit secrets or production credentials.
5. `kovaos.com` is the canonical KOVA domain.
