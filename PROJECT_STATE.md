# Project State

**Last updated:** 2026-07-15 America/New_York

**Updated by:** Codex / project control

**Current phase:** Milestone 0 / Quest device verification pending

**Overall status:** Conditional pass: automated and desktop validation passed; Quest verification **NOT RUN**

## One-paragraph state summary

The Milestone 0 Vite, TypeScript, Three.js, and WebXR technical spike is implemented on `feature/milestone-0-webxr-spike`. It renders a shared room-relative reference scene on desktop, distinguishes WebXR capability/session states, requests `immersive-ar` with required `local-floor`, produces relative static assets, and includes a GitHub Pages workflow configuration. Type-check, 7 Vitest tests, production build, development-mode inspection, and production-preview inspection passed. Quest passthrough, floor registration, stability, drift, and recenter behavior remain **NOT RUN** pending an authorized HTTPS deployment and physical Meta Quest 3 test.

## Working and verified

- `npm run typecheck`: passed with TypeScript `7.0.2`.
- `npm run test`: 1 file and 7 tests passed with Vitest `4.1.10`.
- `npm run build`: passed with Vite `8.1.4`; `dist/` contains relative `./assets/...` references.
- Desktop development scene rendered with origin, X/Y/Z axes, floor ring, and zenith/nadir line.
- OrbitControls interaction changed the camera view; resize updated the canvas from the viewport dimensions.
- Unsupported WebXR messaging was readable in the Codex in-app Chromium browser and Chrome; neither reported console errors or warnings.
- Production preview loaded successfully in both available Chromium surfaces.

## Implemented but not fully verified

- Secure-context, WebXR API, immersive-AR support, and session lifecycle state handling is implemented and unit-tested without an XR runtime.
- An explicit user action requests `immersive-ar` with `requiredFeatures: ['local-floor']` and prevents duplicate requests.
- The renderer is alpha-enabled, clears its opaque background in XR, and uses the Three.js XR animation loop.
- Floor-relative reference geometry is authored around `Y = 0` and the XR reference-space type is `local-floor`.
- The GitHub Pages workflow is present but has not run because no remote or Pages site exists.

## In progress

- None. The implementation is ready for review and physical Quest acceptance testing.

## Blocked

- Quest device verification requires an authorized deployed HTTPS URL and a physical Meta Quest 3.

## Known defects or limitations

- Quest testing: **NOT RUN**.
- WebXR passthrough, transparency, floor alignment, stability, drift, session re-entry, and recenter behavior are unverified.
- Desktop Chromium reports immersive AR as unsupported; desktop validation cannot exercise the Enter AR path.
- The production bundle contains a 546.17 kB minified Three.js chunk and triggers Vite's 500 kB advisory; no runtime defect was observed.
- No Git remote or deployed URL exists, and the Pages workflow is unexercised.

## Important unknowns

- Current Quest Browser immersive-AR and passthrough behavior.
- `local-floor` accuracy, stability, and response to recenter/session changes.
- Final GitHub repository name and Pages enablement.
- Milestone 1 controller behavior and later astronomy validation tolerances.

## Active artifacts

| Artifact | Purpose | Status |
|---|---|---|
| `src/` | Milestone 0 scene, renderer, UI, and WebXR state/session logic | Implemented; device behavior unverified |
| `tests/xr-state.test.ts` | Capability and session-state tests | 7/7 passed |
| `README.md` | Commands, behavior, deployment strategy, and limits | Current |
| `docs/ARCHITECTURE.md` | Implemented Milestone 0 boundaries and assumptions | Current |
| `docs/QUEST_TESTING.md` | Physical Quest acceptance checklist | Ready; NOT RUN |
| `.github/workflows/deploy-pages.yml` | Pages validation/build/deploy configuration | Present; not run |
| `COSMIC_CALIBRATION_WEBXR_PROJECT_BRIEF.md` | Product concept and long-term context | Active reference |
| `PROJECT_CHARTER.md` | Project definition and boundaries | Active |
| `DECISIONS.md` | Accepted foundation decisions | Active; unchanged this task |
| `NEXT_TASK.md` | One bounded Quest acceptance task | Active |

## Environment

| Item | Current value | Verified? |
|---|---|---|
| Operating system | Windows | Yes |
| Runtime/toolchain | Node.js `v24.18.0`; npm `11.16.0` | Yes |
| Runtime dependency | Three.js `0.185.1` | Yes |
| Development dependencies | Vite `8.1.4`; TypeScript `7.0.2`; Vitest `4.1.10`; Three/WebXR types | Yes |
| Build command | `npm run build` | Passed |
| Test command | `npm run test` | 7/7 passed |
| Deployment target | GitHub Pages workflow configuration only | Not exercised |

## Risks

| Risk | Likelihood | Impact | Mitigation or next evidence |
|---|---|---|---|
| Quest Browser behavior differs from desktop-tested assumptions | Medium | High | Execute the physical checklist |
| `local-floor` registration or recenter behavior is unstable | Medium | High | Record floor, motion, drift, re-entry, and recenter evidence |
| Transparent rendering does not expose passthrough as expected | Medium | High | Verify on Quest 3; do not infer from code |
| Bundle size affects Quest startup/performance | Low/unknown | Medium | Measure on device before adding optimization complexity |
| Scientific and contemplative layers become conflated later | Medium | High | Preserve traceable scientific modules and explicit framing |

## Parking Lot

- Astronomy Engine; celestial bodies, ecliptic, poles, and real-time astronomy.
- North calibration, geolocation, controllers, persistence, and magnetic declination.
- Orbital-awareness, time navigation, and teaching-scale modes.
- Contemplative, sacred-geometry, cultural, and symbolic layers, clearly distinct from scientific claims.
- Star catalog, audio, hand tracking, persistent anchors, multi-user use, and native applications.

## Recent evidence

| Date | Evidence | Result | Location |
|---|---|---|---|
| 2026-07-15 | Baseline checkpoint | Local Git baseline established | Commit `96aea97` |
| 2026-07-15 | Dependency installation | Allowed set installed; npm reported 0 vulnerabilities | `package-lock.json` |
| 2026-07-15 | Type-check and unit tests | PASS; 7/7 tests | `npm run typecheck`; `npm run test` |
| 2026-07-15 | Production build and path inspection | PASS; relative asset paths | `npm run build`; `dist/index.html` |
| 2026-07-15 | Desktop development inspection | PASS; scene, controls, resize, status UI, no console errors | `npm run dev -- --host 127.0.0.1` |
| 2026-07-15 | Production preview in two Chromium surfaces | PASS; scene and unsupported state rendered, no console errors | `npm run preview -- --host 127.0.0.1` |
| 2026-07-15 | Physical Quest 3 validation | NOT RUN | `docs/QUEST_TESTING.md` |

## Current decision horizon

Obtain physical Quest 3 evidence for the existing technical spike before starting north calibration or other later-milestone work.
