# Project State

**Last updated:** 2026-07-15 America/New_York

**Updated by:** Codex / project control

**Current phase:** Milestone 0 integrated / hosted testing preparation

**Overall status:** **CONDITIONAL PASS** pending hosted physical Quest testing. Automated and desktop validation passed; Quest verification is **NOT RUN**.

## One-paragraph state summary

Milestone 0 is integrated into local `master` through merge commit `df8b26a`. The independent re-gate found no remaining blocking or material implementation, lifecycle, workflow, test, documentation, dependency, or scope defects. Automated validation and desktop Chromium validation passed on the feature branch, then the complete automated suite and production preview passed again on `master`. Quest passthrough, floor registration, stability, drift, session re-entry, and recenter behavior remain **NOT RUN**. The Pages workflow exists but has not run; no remote, deployment, or Pages URL exists.

## Working and verified

- `npm ci`: passed from the committed lockfile.
- `npm run typecheck`: passed with TypeScript `7.0.2`.
- `npm run test`: 1 file and 15 tests passed with Vitest `4.1.10`.
- `npm run build`: passed with Vite `8.1.4`; `dist/` contains relative `./assets/...` references.
- `git diff --check` and `npm ls --depth=0`: passed on the feature branch and again after integration into `master`.
- Independent Milestone 0 re-gate: no blocking or material findings; implementation/workflow gate passed, with overall result **CONDITIONAL PASS** solely because physical Quest validation is pending.
- Desktop development scene rendered with origin, X/Y/Z axes, floor ring, and zenith/nadir line.
- OrbitControls interaction changed the camera view; resize updated the canvas to the tested viewport; unsupported WebXR messaging remained readable with no console errors or warnings.
- Production preview loaded successfully on the feature branch and again from integrated `master`; relative production assets loaded with no console errors or warnings.

## Implemented but not fully verified

- Secure-context, WebXR API, immersive-AR support, and owned-session lifecycle handling are implemented and unit-tested without an XR runtime.
- An explicit user action requests `immersive-ar` with `requiredFeatures: ['local-floor']`. Internally, the controller distinguishes idle, requesting, acquired/render-binding, binding-after-end, active, and ending/cleanup phases.
- An acquired session is owned and given an `end` listener before renderer binding. Binding failure requests `session.end()` and blocks retry until cleanup settles; cleanup failure is surfaced while stale ownership is cleared.
- The renderer is alpha-enabled, clears its opaque background in XR, and uses the Three.js XR animation loop.
- Floor-relative reference geometry is authored around `Y = 0` and the XR reference-space type is `local-floor`.
- The GitHub Pages workflow is present on `master` with Pages/OIDC permissions limited to its deploy job, but has not run because no remote or Pages site exists.

## In progress

- Publish the Milestone 0 test site to GitHub Pages after explicit authorization of the account, repository, remote, push, Pages enablement, and deployment actions.

## Blocked

- Quest device verification requires an authorized deployed HTTPS URL and a physical Meta Quest 3.

## Known defects or limitations

- Quest testing: **NOT RUN**.
- WebXR passthrough, transparency, floor alignment, stability, drift, session re-entry, and recenter behavior are unverified on physical hardware.
- Desktop Chromium reports immersive AR as unsupported; desktop validation cannot exercise a browser XR session.
- The production bundle contains a 547.64 kB minified Three.js chunk and triggers Vite's 500 kB advisory; no runtime defect was observed.
- No Git remote or deployed URL exists, and the Pages workflow is unexercised.

## Important unknowns

- Current Quest Browser immersive-AR and passthrough behavior.
- `local-floor` accuracy, stability, and response to recenter/session changes.
- Final GitHub repository name and Pages enablement.
- Milestone 1 controller behavior and later astronomy validation tolerances.

## Active artifacts

| Artifact | Purpose | Status |
|---|---|---|
| `src/` | Milestone 0 scene, renderer, UI, and WebXR state/session logic | Integrated into `master`; device behavior unverified |
| `tests/xr-state.test.ts` | Capability and deterministic session-lifecycle tests | 15/15 passed |
| `README.md` | Commands, behavior, deployment strategy, and limits | Current |
| `docs/ARCHITECTURE.md` | Implemented Milestone 0 boundaries and lifecycle model | Current |
| `docs/QUEST_TESTING.md` | Physical Quest acceptance checklist | Ready; NOT RUN |
| `.github/workflows/deploy-pages.yml` | Pages validation/build/deploy configuration | Present; not run |
| `COSMIC_CALIBRATION_WEBXR_PROJECT_BRIEF.md` | Product concept and long-term context | Active reference |
| `PROJECT_CHARTER.md` | Project definition and boundaries | Active |
| `DECISIONS.md` | Accepted foundation decisions | Active; unchanged this task |
| `NEXT_TASK.md` | One authorization-gated Pages publication task | Active |

## Environment

| Item | Current value | Verified? |
|---|---|---|
| Operating system | Windows | Yes |
| Runtime/toolchain | Node.js `v24.18.0`; npm `11.16.0` | Yes |
| Runtime dependency | Three.js `0.185.1` | Yes |
| Development dependencies | Vite `8.1.4`; TypeScript `7.0.2`; Vitest `4.1.10`; Three/WebXR types | Yes |
| Build command | `npm run build` | Passed |
| Test command | `npm run test` | 15/15 passed |
| Deployment target | GitHub Pages workflow configuration only | Not exercised |

## Risks

| Risk | Likelihood | Impact | Mitigation or next evidence |
|---|---|---|---|
| Session lifecycle regression remains despite local tests | Low/unknown | High | Independent lifecycle review and physical Quest test after integration |
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
| 2026-07-15 | Initial Milestone 0 implementation | Independent integration gate failed; remediation required | Commit `420b7f9` |
| 2026-07-15 | Session lifecycle remediation | PASS; acquired-session ownership, cleanup, retry, and end-race tests added | `tests/xr-state.test.ts` |
| 2026-07-15 | Dependency installation | PASS; allowed set installed from lockfile | `npm ci` |
| 2026-07-15 | Type-check and unit tests | PASS; 15/15 tests | `npm run typecheck`; `npm run test` |
| 2026-07-15 | Production build and path inspection | PASS; relative asset paths | `npm run build`; `dist/index.html` |
| 2026-07-15 | Desktop development and production-preview inspection | PASS; scene, controls, status UI, and console checks | Local Vite dev and preview |
| 2026-07-15 | Independent Milestone 0 re-gate | PASS for implementation, workflow, automated, desktop, documentation, and scope checks; overall CONDITIONAL PASS pending Quest | Feature commit `eccc78b` |
| 2026-07-15 | Local Milestone 0 integration and revalidation | PASS; merged without rewriting history and reran the full local suite | Merge commit `df8b26a` on `master` |
| 2026-07-15 | Physical Quest 3 validation | NOT RUN | `docs/QUEST_TESTING.md` |

## Current decision horizon

Obtain explicit publication authorization, publish the exact integrated `master` build through the existing Pages workflow, record the HTTPS URL, then perform the separate physical Quest 3 acceptance test.
