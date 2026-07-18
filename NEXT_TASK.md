# Next Task

This file contains exactly one bounded next task.

## Task

**Title:** Independently validate and publish the hardened geocentric axis renderer

## Recommended execution

- **Codex model:** GPT-5.6 Sol
- **Reasoning effort:** Max
- **Branch under review:** `feature/milestone-2b-geocentric-world-axis`
- **Why:** the re-gate must independently check homogeneous projective mathematics, per-eye
  camera-relative precision, WebXR compositor-depth safety, lifecycle ownership, and publication
  without relying on the remediation builder's tests alone.

## Objective

Independently reproduce the prior failed GPU/depth/disposal probes and verify the unchanged
WGS84/P03 scientific contract. If and only if every material gate passes, merge normally into
`master`, revalidate, push without force under existing authorization, verify GitHub Actions and
Pages, and prepare the physical Quest acceptance procedure.

## Required gate

1. Confirm raw `10^13 m` positions never enter GPU attributes, object transforms, matrices, or
   shaders; diagnostic finite points must remain CPU-only.
2. Reproduce the per-eye camera-relative transform for head translation, rotation, representative
   stereo offsets, calibrated yaw, supported observer latitude/elevation, and float32 budgets.
3. Verify homogeneous `w = 1` core and `w = 0` antipodal pole directions form one continuous
   projective line through the scientific Earth core without screen locking or mono-eye reuse.
4. Confirm the shared renderer uses ordinary linear `0.01–100 m` depth, celestial materials never
   test/write depth, and no compositor-incompatible logarithmic depth path remains.
5. Verify clear/rebuild, repeated visibility/recalibration, session exit/re-entry, page teardown,
   and idempotent disposal release only owned resources without duplication.
6. Run clean install, type-check, full tests, production build, diff/dependency checks, development,
   and production-preview regression. No dependency or workflow change is allowed.
7. Keep physical Quest stereo comfort, passthrough visibility, world locking, and compositor
   behavior **NOT RUN** until a passing integration/publication gate creates the hosted candidate.

## Explicit exclusions

Do not implement the celestial equator, precession trajectories, Sun, Moon, planets, ecliptic,
temporal clocks, geolocation, Earth sphere, media, relational circuits, game systems, AI
enhancement, audio, or contemplative sequencing.

## Stop conditions

Stop without merge, push, or deployment if raw large coordinates remain, the per-eye projective
transform is ambiguous, depth can be misinterpreted by the XR compositor, disposal is incomplete,
tests are misleading, dependencies/workflows change, or physical Quest evidence is required to
decide the code gate.
