# Cosmic Calibration WebXR

Cosmic Calibration is a mixed-reality cosmic-navigation project intended to make celestial reference geometry spatially perceptible. This repository currently contains the Milestone 0 technical spike: a calm room-relative reference scene, desktop inspection controls, and an explicit WebXR immersive-AR entry path that requires `local-floor`.

Scientific geometry and contemplative interpretation are separate layers. This spike contains no astronomical or metaphysical claims.

## Current scope

Milestone 0 renders:

- a floor-origin marker;
- room-relative X/Y/Z axes;
- a horizon ring at `Y = 0`;
- a zenith/nadir line;
- a WebXR capability and session-status panel.

X and Z are room-relative and are not geographic cardinal directions. The transparent XR renderer and required `local-floor` feature are implementation assumptions until physically tested on Quest 3.

## Prerequisites

- Node.js 24 or another current compatible LTS release
- npm
- A modern desktop browser for fallback inspection
- A deployed HTTPS URL and Meta Quest 3 for device validation

## Local commands

```powershell
npm install
npm run dev -- --host 127.0.0.1
npm run typecheck
npm run test
npm run build
npm run preview -- --host 127.0.0.1
```

The development server URL shown by Vite opens the desktop fallback. Mouse drag orbits the camera; the wheel zooms. Browsers without WebXR retain the scene and show a specific compatibility state.

## WebXR requirements

The application checks for a secure context, `navigator.xr`, and support for `immersive-ar`. Entering AR requires an explicit button press and requests only `local-floor`. Session denial or failure leaves the desktop scene running, and session end restores desktop presentation.

`localhost` is acceptable for local browser development, but it does not prove that an arbitrary HTTP origin will work. Physical Quest testing requires HTTPS. See [Quest testing](docs/QUEST_TESTING.md).

## Static build and GitHub Pages

Vite uses `base: './'`, so emitted asset references are relative and the build remains portable when the final project repository name—and therefore its Pages subpath—is unknown. The tradeoff is that this strategy assumes document-relative assets and no client-side routing. Milestone 0 uses neither routing nor a backend.

The Pages workflow validates with `npm ci`, type-checks, tests, builds, and uploads `dist/` before the standard deployment job. The workflow is configuration only: it cannot run until a GitHub remote exists and Pages is enabled. This task does not create a remote, push, enable Pages, or deploy.

## Current limitations

- Quest Browser immersive AR: **NOT RUN**
- Passthrough visibility/transparency: **NOT RUN**
- `local-floor` registration, stability, drift, and recenter behavior: **NOT RUN**
- Desktop rendering cannot prove any of the device behaviors above.
- The reference scene has no geographic or astronomical calibration.

## Explicitly deferred

Geolocation, north calibration, controllers, persistence, hit testing, plane detection, Astronomy Engine, celestial bodies, cardinal directions, time controls, spatial anchors, hand tracking, contemplative sequences, accounts, analytics, and backend services are intentionally absent.
