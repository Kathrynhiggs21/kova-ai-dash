
# Project TODO

- [x] Preserve the existing Kova Integration Hub UI while resolving full-stack upgrade conflicts
- [x] Define persistent database tables for integrations, connection metadata, and stored file metadata
- [x] Generate and apply the database migration using the project schema workflow
- [x] Add typed tRPC queries and mutations for persisted integration records
- [x] Add authenticated file upload handling through the built-in S3 storage helpers
- [x] Persist uploaded file metadata and render stored files in the hub UI
- [x] Add success, empty, loading, and error states for database and file-storage flows
- [x] Add Vitest coverage for persistence and storage procedure behavior
- [x] Run typecheck, tests, build, and browser verification
- [x] Save a checkpoint after the full-stack conversion is verified
- [x] Add explicit query error and loading states to the Integration Hub and Storage Vault
- [x] Add Vitest coverage for integration seeding, listing, updates, file metadata persistence, and upload success/failure paths
- [x] Show an explicit loading state for the Storage Vault integration selector
- [x] Add unit coverage for real integration seeding and stored-file metadata helper behavior using controlled database doubles

- [x] Replace the current hero orb visual with the reflective-wave and particle treatment
- [x] Refine orb idle, listening, speaking, and processing motion states
- [x] Add reduced-motion handling for the revised orb animation
- [x] Verify the orb asset, voice motion, typecheck, tests, and production build
- [ ] Save a checkpoint for the orb and motion update
- [x] Add focused unit coverage for the orb asset path and voice-state API
- [x] Wire KovaOrb to real UI state so listening, processing, and speaking variants can appear in the app
- [x] Add a small in-app voice-state control/demo without auto-opening microphone access
- [x] Re-run typecheck, tests, build, and browser verification across all four orb states
- [x] Verify idle, listening, processing, and speaking orb states in the browser before the final checkpoint
- [x] Verify the listening orb state in the browser with visible evidence showing the rendered state
- [x] Verify the speaking orb state in the browser with visible evidence showing the rendered state
