# Next Task

This file contains exactly one bounded next task.

## Task

**Title:** Validate the Milestone 2 astronomy adapter and pole-model contract

## Recommended execution

- **Codex model:** GPT-5.6 Sol
- **Reasoning effort:** Max
- **Branch:** `feature/milestone-2-astronomy-validation`
- **Starting point:** the accepted local `master` tip containing the Milestone 2 architecture;
  preserve the existing unpushed Milestone 1 completion and architecture commits.

## Why this is next

The architecture recommends Astronomy Engine for application-level ephemerides and supported
transforms, but its public interface does not document the precession-only mean-equator-of-date
orientation required by the selected P03 structural axis. A narrow, non-visual spike must prove
the library adapter, frame signs, deterministic fixtures, and mean-pole provider before the full
scientific foundation or any celestial geometry is implemented.

## Objective

Implement and independently validate the smallest non-visual astronomy boundary that can prove:

1. an exact reviewed Astronomy Engine release works in the current static browser toolchain;
2. scientific values remain strongly tagged with frame, origin, units, time, observer,
   corrections, provider, version, and precision provenance;
3. the `EQJ -> HOR -> canonical ENU -> Three.js` basis/sign mapping is correct; and
4. the application has a supportable, independently validated route to an IAU P03
   precession-only mean pole/equator of date.

## Authorized scope

- Create the feature branch named above from the accepted local `master` tip.
- Recheck Astronomy Engine's current official package metadata and MIT terms, select and pin one
  exact version, and add only that runtime dependency if all review gates pass.
- Add a focused adapter/prototype module with no visible scene output.
- Add the minimum immutable observer/time snapshot types needed to test the adapter; do not build
  user-facing location or time state.
- Implement explicit tagged results and canonical ENU conversions without importing Three.js into
  the scientific provider layer.
- Establish the precession-only mean-pole approach through a documented provider or minimal
  validated application calculation. Compare its semantics with SOFA/P03 evidence.
- Capture only bounded, reviewable offline fixtures from authoritative sources with source,
  version, query/configuration, time scale, observer, correction, retrieval date, and tolerance
  provenance.
- Update architecture records only to reflect evidence actually established by the spike.

## Required tests

1. Exact basis vectors and handedness for Astronomy Engine horizontal north/west/zenith,
   canonical east/north/up, and Three.js `(east, up, -north)`.
2. Forward/inverse round trips, normalization, angle normalization, and units conversion.
3. Tagged-frame mismatch, non-finite input, invalid observer, and mismatched-time rejection.
4. Deterministic clock behavior with no hidden system-time reads.
5. At least one fixed observer/time Sun case and one Moon case against versioned independent
   reference fixtures, with tolerances declared before results are compared.
6. True `EQD` behavior named and checked separately from the precession-only mean-pole result.
7. Mean north/south poles are exact antipodes; their equator normal is the same axis.
8. Provider/cache invalidation across observer, instant, correction, model, and version revisions.
9. Existing 66-test Milestone 0/1 suite remains passing and unchanged in strength.

## Validation

Run at minimum:

```powershell
npm ci
npm run typecheck
npm run test
npm run build
git diff --check
npm ls --depth=0
```

Also inspect the exact dependency/license delta, production bundle impact, emitted relative asset
paths, absence of live-network runtime calls, all fixture provenance, and the complete diff. Run
development and production-preview regression checks for the existing Milestone 0/1 scene,
desktop north simulation, reset, OrbitControls, resize, fallback status, and console health.

An independent gate must review the mean-pole semantics and reference comparisons before the
result is accepted. Physical Quest celestial validation is **NOT APPLICABLE** because this task
adds no visible celestial feature; existing XR behavior receives regression checks only if the
runtime bundle changes materially.

## Explicit exclusions

- No visible Earth axis, celestial poles, celestial equator, ecliptic, precession paths, Sun,
  Moon, planets, stars, or temporal markers.
- No geolocation, automatic time-zone choice, user-facing date/time controls, EOP download,
  persistence, spatial anchors, or calibration changes.
- No nutation visualization, polar motion, Chandler wobble, observed pole offsets, or Tier 3
  reference mode.
- No labels, new XR controls, contemplative sequencing, audio, deployment, or push.
- Do not port SOFA code or copy formulas without a separate license and scientific review.

## Stop conditions

Stop and return a bounded research/remediation task without inventing a fallback if:

- the exact Astronomy Engine package/license/import contract cannot be established;
- installation requires unrelated dependencies or a package/toolchain upgrade;
- authoritative fixtures cannot be reproduced with fully matched semantics;
- the proposed mean-pole result cannot be shown to be precession-only P03 or an explicitly
  equivalent supported model;
- the only available result mixes nutation, polar motion, observed offsets, or unknown corrections;
- a numerical tolerance would need to be chosen after seeing the comparison result;
- a source, workflow, deployment, or visible-feature change becomes necessary; or
- existing Milestone 0/1 behavior regresses.

## Completion boundary

The task completes with a reviewed non-visual adapter/prototype, deterministic evidence, an
accepted or rejected mean-pole route, reconciled documentation, and a clean feature-branch
checkpoint. It does not proceed into the full Milestone 2 scientific foundation or any visible
celestial layer.
