# Milestone 0 Architecture

## Purpose and boundary

Milestone 0 isolates the browser and WebXR platform risk. Three.js supplies one small scene graph and renderer; WebXR supplies capability detection, immersive-session lifecycle, and the requested floor-relative reference space. No calibration or astronomy layer is implemented.

## Shared desktop and XR scene

`src/scene/createReferenceScene.ts` creates one scene used in both modes. Desktop uses a perspective camera with `OrbitControls`. XR uses the same authored geometry through the renderer's XR camera. The renderer uses an XR-compatible animation loop in both cases.

The desktop scene has a dark background. During an immersive session the scene background is cleared and renderer alpha is zero so an AR compositor can show the environment. This is only a passthrough-enabling assumption; transparent rendering does not prove Quest passthrough.

## Coordinate conventions

- `+Y`: local up / zenith
- `-Y`: local down / nadir
- `Y = 0`: requested local floor/reference plane
- X and Z: room-relative axes with no geographic meaning

The origin marker and horizon ring are authored at the reference origin and `Y = 0`. The session requests `local-floor`, and Three.js is configured for the same reference-space type. Code structure alone does not prove accurate floor registration, world stability, or recenter behavior.

## Capability-state model

`src/xr/state.ts` distinguishes:

- insecure context;
- missing WebXR API;
- capability check in progress;
- immersive AR supported or unsupported;
- capability-check failure;
- session starting, active, ended, or denied/failed.

Detection checks `window.isSecureContext`, then `navigator.xr`, then `isSessionSupported('immersive-ar')`. Pure interfaces keep this logic testable without a headset or browser XR runtime.

## Session lifecycle

The explicit Enter AR action calls `requestSession('immersive-ar', { requiredFeatures: ['local-floor'] })`. No optional future features are requested. Duplicate requests are ignored while a request or session is active. A successful session is bound to the renderer; an end event restores the desktop state. Rejection and binding failures become readable UI states while detailed errors remain available to the console.

## Static hosting

`vite.config.ts` uses a relative `./` base. Built script and style references therefore work under an unknown GitHub Pages project subpath without hardcoding a repository name. The current application has no router, backend, or server-only behavior. The workflow file follows the Pages artifact pattern but cannot be exercised until an authorized remote and Pages configuration exist.

## Module boundaries

- `src/main.ts`: renderer, camera, controls, DOM status, and lifecycle wiring.
- `src/scene/createReferenceScene.ts`: neutral floor-origin reference geometry.
- `src/xr/state.ts`: capability classification and immersive-session state transitions.
- `tests/xr-state.test.ts`: capability and session-state behavior.

These boundaries are deliberately narrow. They are not a generalized future architecture.

## Deferred architecture

Geolocation, geographic calibration, controllers, persistence, astronomy calculations, celestial rendering, time controls, and experiential layers are absent. Later scientific modules must keep source coordinates and units separate from display coordinates and teaching-scale transforms so claims remain traceable. That future separation is a constraint, not an implemented capability.
