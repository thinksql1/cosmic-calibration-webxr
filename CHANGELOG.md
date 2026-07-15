# Changelog

## Unreleased

### Added

- Project charter and state initialized from the reviewed orientation evidence.
- Initial project decisions accepted.
- Repository baseline established.
- Milestone 0 Vite, TypeScript, Three.js, and WebXR technical spike.
- Shared desktop/XR reference scene with floor origin, room-relative axes, horizon ring, and zenith/nadir line.
- Explicit immersive-AR capability and session-state handling requiring `local-floor`.
- Focused Vitest coverage for capability and session lifecycle states.
- GitHub Pages workflow configuration and Milestone 0 architecture/Quest testing documentation.

### Changed

- `NEXT_TASK.md` now contains the bounded physical Quest 3 acceptance test.

### Validated

- Node.js, npm, and Git availability verified during activation.
- Type-check, 7/7 unit tests, and production build passed.
- Desktop development and production-preview scenes passed manual inspection in two Chromium surfaces with no console errors.
- Production asset references are relative and suitable for an unknown Pages project subpath.

### Known limitations

- Quest WebXR, passthrough, `local-floor`, stability, and recenter validation remain **NOT RUN**.
- The Three.js production chunk triggers Vite's 500 kB size advisory.
- No remote or deployment exists; the Pages workflow has not run.
