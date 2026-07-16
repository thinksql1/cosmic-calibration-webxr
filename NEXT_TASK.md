# Next Task

This file contains exactly one bounded next task.

## Task

**Title:** Implement the Milestone 2 non-visual scientific foundation

## Recommended execution

- **Codex model:** GPT-5.6 Terra
- **Reasoning effort:** High
- **Why:** the next work is a bounded implementation with accepted frame/time contracts and strong
  fixtures, but snapshot/cache invalidation still requires careful cross-module reasoning; use a
  separate GPT-5.6 Sol Max gate before integration.
- **Branch:** `feature/milestone-2a-scientific-foundation`
- **Starting point:** independently review and integrate the completed Milestone 2A0 branch before
  creating the implementation branch; preserve all existing local commits and do not push without
  separate authorization.

## Objective

Turn the validated 2A0 spike into the production-quality, still non-visual Milestone 2A
foundation. Establish one revisioned observer state, one deterministic simulation snapshot, a
stable provider facade, and exact cache/invalidation behavior that later scientific layers can
consume without bypassing frame, time, correction, datum, or provenance contracts.

## Authorized scope

- Promote the validated observer and simulation-instant types into a coherent application state
  with explicit revisions and immutable calculation snapshots.
- Add an explicit IANA time-zone identifier for future labels while keeping UTC/TT calculations
  independent of civil-time formatting.
- Create one application-owned astronomy-provider facade over the accepted Astronomy Engine
  adapter and P03 mean-pole provider.
- Add a bounded cache keyed by observer revision, instant revision, body, frame, correction
  profile, model, and exact provider version.
- Define deterministic invalidation when observer, time, correction, model, or provider revision
  changes; unchanged inputs must reuse only semantically identical results.
- Preserve exact frame tags, units, longitude sign, vertical datum, UTC/TT provenance, correction
  profiles, and canonical ENU/application mapping.
- Promote the frozen JPL/SOFA/P03 fixtures into a reproducible manifest without live test-network
  access.
- Preserve the upstream Astronomy Engine MIT notice before provider code enters the distributed
  production bundle; the installed tarball's package metadata declares MIT but includes no
  standalone license file.
- Update scientific contracts and project records only for behavior actually implemented and
  validated.

## Explicit exclusions

- No visible Earth axis, celestial poles, celestial equator, ecliptic, precession path, Sun, Moon,
  planet, star, label, or temporal marker.
- No Three.js or XR celestial group and no new production UI.
- No automatic geolocation, permission request, automatic time-zone selection, user-facing clock,
  date/time control, persistence, or system-clock polling.
- No EOP download, leap-second service, SOFA/NOVAS dependency, Tier 2/Tier 3 promotion, true/CIP
  pole, nutation visualization, polar motion, Chandler wobble, or observed pole offsets.
- No dependency/version change beyond the accepted `astronomy-engine@2.1.19` package unless a
  stop condition is reported for review.
- No deployment, push, Milestone 2B geometry, or contemplative sequencing.

## Required tests

1. Immutable observer and simulation snapshot creation with stable monotonically changing
   revisions.
2. UTC calculation state remains separate from explicit IANA civil-label state.
3. Cache keys distinguish observer, instant, body, frame, correction profile, model, and provider
   version.
4. Each relevant revision invalidates exactly the affected cached result; identical snapshots are
   deterministic and safely reusable.
5. Invalid datum, non-finite input, stale/mismatched snapshot, unsupported correction, and domain
   failures remain typed and recoverable.
6. Existing ENU, application-basis, JPL Horizons, SOFA matrix, P03 pole, exact antipode, and
   mean/true separation tests remain passing unchanged in strength.
7. No science module imports Three.js, reads `Date.now()`, calls `new Date()` without an explicit
   input, or performs a network request.
8. Existing Milestone 0/1 behavior and all 135 current tests remain passing.

## Validation

Run:

```powershell
npm ci
npm run typecheck
npm run test
npm run build
git diff --check
npm ls --depth=0
```

Inspect the complete dependency and source diff, emitted relative assets, absence of unexpected
runtime/UI imports, exact fixture provenance, and production bundle delta. Desktop and Quest
celestial validation are **NOT APPLICABLE** because no visible celestial behavior is authorized;
run existing scene regression checks only if the application entry path changes unexpectedly.

## Acceptance criteria

1. A single immutable calculation snapshot carries observer, UTC instant, civil-zone identifier,
   correction/model selections, revisions, and provider provenance.
2. Provider calls accept the snapshot rather than independent ambient values.
3. Cache and invalidation behavior is deterministic and fully tested.
4. Civil time cannot alter the scientific instant.
5. Exact accepted 2A0 dependency, frame, time, observer, correction, and pole contracts remain
   intact.
6. Independent fixtures remain offline and passing within their predeclared tolerances.
7. The distributed provider has an explicit upstream MIT notice and exact version attribution.
8. No visible celestial or deferred system is added.
9. Exactly one next task is selected from the evidence after completion.

## Stop conditions

Stop and report a bounded finding if:

- a new runtime or development dependency appears necessary;
- cache correctness requires weakening frame/provenance types;
- civil time cannot remain separate from UTC/TT calculations;
- the accepted P03 or Astronomy Engine fixture results regress;
- an implicit system clock, live network, geolocation, UI, Three.js celestial code, or visible
  geometry becomes necessary;
- a provider/version update is proposed without a new scientific comparison; or
- existing Milestone 0/1 application behavior regresses.

## Completion boundary

Complete the production-quality non-visual state/provider/cache foundation, its tests,
documentation reconciliation, and one local feature-branch checkpoint. Stop before visible
Milestone 2B axis/pole geometry, merge, push, deployment, or physical Quest celestial testing.
