# Next Task

This file contains exactly one bounded next task.

## Task

**Title:** Implement the coherent Earth axis and celestial poles

## Recommended execution

- **Codex model:** GPT-5.6 Sol Max
- **Reasoning effort:** High
- **Why:** this is the first visible consumer of validated scientific snapshots and requires careful frame, observer-horizontal, presentation, and physical-XR review.
- **Branch:** `feature/milestone-2b-earth-axis-poles`

## Objective

Implement the smallest calm visual layer that consumes a ready Milestone 2A scientific snapshot and presents one coherent P03 mean Earth axis with exact antipodal north and south celestial-pole endpoints.

## Required scope

- Consume the validated scientific snapshot; do not recompute P03 or create an independent pole model in presentation code.
- Preserve the established tracking, room, calibrated geographic, scientific, horizontal, and presentation-frame boundaries.
- Transform the shared mean axis into the observer-centered display contract with explicit tagged math and deterministic tests.
- Add only one coherent axis line and its antipodal north/south pole endpoints, with restrained optional labels and an explicit below-horizon policy.
- Keep calibration yaw at the existing geographic presentation parent; never rotate the XR camera, renderer, `local-floor`, room diagnostics, controllers, or scientific source coordinates.
- Preserve minimal, calm, low-noise presentation and distinguish the selected P03 mean model from a true, CIP, observed, or instantaneous pole.

## Explicit exclusions

- No celestial-equator geometry.
- No precession trajectories, nutation, polar motion, Chandler wobble, or live EOP.
- No Sun, Moon, planets, ecliptic, temporal clocks, observer/time UI, geolocation, media layers, relational circuits, contemplative sequencing, or new dependency.
- No recomputation of provider/P03 results in Three.js or presentation code.
- No deployment or physical Quest claim until separately authorized and observed.

## Tests and validation

- Prove axis/pole antipodes, unit length, frame tags, handedness, observer-latitude/horizon relationships, below-horizon continuity, and presentation-only calibrated-yaw application.
- Prove missing/invalid snapshots create no partial celestial geometry and state changes replace rather than accumulate visual objects.
- Preserve all 239 existing tests; run clean install, type-check, tests, build, diff, and dependency checks.
- Verify the existing Milestone 0/1 desktop scene, simulation/reset, OrbitControls, resize, relative assets, and console remain healthy.
- Prepare a bounded later Quest acceptance procedure for floor/up/north alignment, expected pole altitude, world locking, below-horizon behavior, readability, and comfort.

## Acceptance criteria

1. One axis and two exact antipodal endpoints derive from the ready scientific snapshot.
2. No P03 calculation or hidden scientific transform exists in presentation code.
3. The selected model is labeled accurately and remains separate from true/CIP/polar-motion concepts.
4. The layer preserves existing room/geographic/XR behavior and minimal visual design.
5. Automated and desktop validation pass; Quest physical validation remains separately observed evidence.

## Stop conditions

Stop if the snapshot lacks enough tagged information for a scientifically explicit observer-horizontal transform, the axis/pole relationship cannot be validated without broadening scope, a new dependency appears necessary, or the implementation would require equator, precession, body, temporal, media, relational, or contemplative work.
