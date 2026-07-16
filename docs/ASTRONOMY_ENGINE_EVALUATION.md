# Astronomy Engine Evaluation

Research claims in this evaluation trace to the [official astronomy source
register](OFFICIAL_ASTRONOMY_SOURCES.md).

## Decision

**Decision: adopt Astronomy Engine `2.1.19` with validation wrappers for the bounded Tier 1
operations proven by Milestone 2A0.**

The official npm and repository metadata identify `astronomy-engine` `2.1.19`, Donald Cross as
author, MIT licensing, CommonJS/ESM/browser entry points, bundled TypeScript declarations, no
declared package dependencies, and `sideEffects: false`. Milestone 2A0 installed that exact
version and pinned it in the lockfile. Registry metadata reports `1,838,627` unpacked bytes. The
installed tarball declares MIT in `package.json` but does not contain a standalone license file;
future distribution must preserve the upstream repository notice. No
other package was added or upgraded; unpacked package size is not treated as a browser-bundle
measurement.

Astronomy Engine is recommended for browser-level ephemerides, observer-relative Sun/Moon/planet
positions, supported event searches, and its documented coordinate transforms. It is not the sole
authority for Earth orientation, a precession-only mean pole, long-term precession trajectories,
UT1, polar motion, or a combined product accuracy claim.

## Milestone 2A0 measured result

- The official ESM/types import passes TypeScript `7.0.2` and Vite `8.1.4`.
- A no-write Vite/Oxc library-mode check bundles the adapter and provider as one ESM chunk with no
  remaining imports (`75,901` bytes minified, `25,178` bytes gzip); this is a compatibility datum,
  not the future production bundle size.
- Raw imports are isolated to `src/science/astronomy/astronomyEngineAdapter.ts`.
- Observer longitude is east-positive; provider elevation is explicitly mean-sea-level meters.
- `Equator(..., true, true)` is exposed only as topocentric `EQD_TRUE`; it is never relabelled as
  a precession-only mean result.
- `Horizon` north-zero/east-positive azimuth is converted to canonical ENU with pure basis tests.
- Three frozen Sun/Moon cases agree with NASA/JPL Horizons DE441 within the predeclared `0.02
  degrees` limit; the largest coordinate difference is `0.008280 degrees` and the largest
  directional angular separation is `0.001276 degrees`. The ellipsoid/MSL height-datum mismatch
  is tagged and is not represented as a geoid conversion or exact same-observer comparison.
- Airless and `normal` refraction are separate profiles; below-horizon results are preserved.
- The provider-apparent label enumerates light-time, parallax, aberration, precession, and
  nutation; it does not claim an undocumented gravitational-deflection correction.
- A separate application-owned P03 provider, not Astronomy Engine, reproduces the IAU SOFA
  `pmat06` matrix fixture and frozen mean-pole vectors.
- The production entry point does not yet consume the science modules, so the emitted 574.29 kB
  application/Three.js chunk is unchanged and no visible runtime behavior was added.

The implemented contract is detailed in [Astronomy Adapter Contract](ASTRONOMY_ADAPTER_CONTRACT.md).

## Evaluation matrix

| Requirement | Finding | Proposed use | Boundary or validation need |
|---|---|---|---|
| Sun position | Supported | Primary runtime ephemeris | Validate selected apparent/topocentric mode against JPL Horizons |
| Moon position | Supported, including topocentric parallax | Primary runtime ephemeris | Golden cases must include Moon because parallax is material |
| Planet positions | Supported for major planets and Pluto | Future runtime ephemeris | Validate each enabled body and date domain before display |
| Equatorial coordinates | `EQJ` and true `EQD` are documented | Tagged adapter outputs | Never call either simply `equatorial` without frame metadata |
| Horizontal coordinates | Supported by `Horizon` and `Rotation_EQJ_HOR` | Observer-relative direction | Map the library's north/west/zenith axes explicitly to canonical ENU |
| Apparent versus astrometric | Light-time is included by relevant APIs; aberration is selectable; topocentric results are supported | Explicit correction profile | Wrapper must name every correction; no ambiguous `position()` method |
| Precession | Included in `EQJ`/`EQD` transforms | True-of-date transformations | Public API does not document a precession-only mean-of-date frame |
| Nutation | Included in `EQD`; implementation release notes describe a truncated IAU 2000B series | Tier 1 true-of-date results | Do not call this IAU 2000A/CIP fidelity without cross-validation |
| Aberration | Selectable in body-vector/equatorial APIs | Apparent-body profile | Must be fixed in test fixtures and result metadata |
| Refraction | Optional `normal` model; `jplhor` exists for test compatibility | Optional presentation/science correction | Initial geometric horizon uses no refraction; weather-dependent truth is outside the built-in model |
| Equator of date | True `EQD` is supported | Apparent/topocentric path | Mean equator of date needs a separate validated provider |
| Ecliptic coordinates | J2000 mean `ECL` and true-of-date `ECT` are documented | Future ecliptic layer | Not part of the first foundation or axis display |
| Rise/set | Supported, including elevated-observer options in current releases | Future solar/lunar event annotations | Event definitions and refraction/limb choices must be displayed and tested |
| Lunar phase | `MoonPhase`, `SearchMoonPhase`, and quarter searches are supported | Future phase symbols and cycle endpoint search | Phase is geocentric elongation; it is not a circular sky path |
| UTC/time handling | `AstroTime` accepts JavaScript `Date`/UTC | Runtime astronomy instant | Library approximates UT1 = UTC and supplies its own TT/delta-T model |
| JavaScript/TypeScript | Browser and Node builds plus declarations | Compatible with Vite/static hosting | Bundle/runtime impact must be measured when the provider enters the production path and later on Quest |
| Browser/static hosting | Explicitly supported, no server required | Compatible with GitHub Pages | No online astronomy service should be needed at runtime |
| License | MIT | Acceptable in principle | Preserve notice and record exact dependency version |
| Deterministic tests | Library is deterministic for fixed inputs; upstream describes cross-language/reference validation | Offline test fixtures | Project tests must not depend on current time or live network responses |

## Why the recommendation is not unqualified adoption

### 1. Pole-model gap and resolution

The public frame list distinguishes J2000 mean equator (`EQJ`) from true equator of date (`EQD`).
It does not document a mean-equator-of-date transform that cleanly exposes precession without
nutation. A long-term precession path needs the precession-only axis; sampling `EQD` would mix
nutation into that path and violate the product requirement.

`RotationAxis(Body.Earth, time)` is documented as a body rotational-elements calculation in
J2000 coordinates. It must not be assumed to be the IAU 2006 mean pole or the IAU 2006/2000A
Celestial Intermediate Pole. Milestone 2A0 did not use it. Instead, the application now owns a
direct P03 bias-precession provider validated against IAU SOFA `pmat06`. This resolves the bounded
mean-axis contract without pretending Astronomy Engine exposes that quantity. Full-cycle
precession trajectories remain unresolved and separately gated.

### 2. Earth-orientation gap

The library documents `AstroTime.ut` as a UT1/UTC approximation and does not expose live IERS
polar motion, UT1-UTC, or observed celestial-pole offsets as an application contract. That is
appropriate for the initial browser tier but insufficient for a future high-precision reference
mode.

### 3. Datum and elevation boundary

Astronomy Engine documents geographic latitude, east-positive longitude, and elevation above
mean sea level. W3C Geolocation defines WGS 84 latitude/longitude and, when available, altitude
above the WGS 84 ellipsoid. The application must preserve `heightValue`, `heightDatum`, and
uncertainty instead of silently passing an ellipsoidal height as mean-sea-level height; a missing
browser altitude remains missing rather than being fabricated.

### 4. Accuracy boundary

Upstream describes a compact-library design target of within plus or minus one arcminute against
NOVAS for its supported calculations. That is a library claim, not a measured Cosmic Calibration
result. North-marker error, observer-location uncertainty, floor/up error, Quest tracking, display
placement, and time-label errors remain separate and may dominate.

## Responsibility split

### Astronomy Engine should own

- Supported Sun, Moon, and planet ephemerides.
- Light-time and selectable aberration through documented APIs.
- Topocentric parallax through documented observer-aware APIs.
- `EQJ`, true `EQD`, `ECL`, `ECT`, and `HOR` transformations where their documented semantics
  match the selected product mode.
- Supported rise/set, altitude/hour-angle, lunar-phase, illumination, and season searches in
  later milestones.
- Its internal UTC-to-TT approximation within the declared initial precision tier.

### The application should own

- The single simulation clock and civil-time label policy.
- Observer input provenance, datum, uncertainty, validation, and invalidation.
- Strongly tagged scientific result types: origin, axes, epoch/equinox, units, correction profile,
  time, observer, library version, and precision tier.
- The precession-only mean-axis provider and its validation contract.
- Selection between mean structural geometry and true/apparent geometry.
- Canonical east/north/up directions and the explicit mapping into Three.js.
- Geographic calibration and the room-to-geographic display transform.
- Presentation radius, line styles, visibility, labels, interpolation, and layer sequencing.
- The complete error budget and user-facing limitations.

### Standards/reference validation should own

- SOFA: frame/time transformation goldens, IAU 2006/2000A comparisons, matrix orientation, and
  mean/true model checks.
- IERS: the conceptual separation and, in a future Tier 3, versioned EOP inputs.
- JPL Horizons: observer-relative Sun/Moon/planet azimuth-altitude goldens with exact query
  settings.
- NOVAS: an additional independent apparent/topocentric reference where practical.

## Implemented adapter boundary and next-foundation target

Milestone 2A0 implements immutable instant/observer inputs and tagged equatorial/horizontal
results. The following facade is the Milestone 2A target, not current 2A0 behavior; revisioned
snapshots, caching, and event schedules remain unimplemented:

```text
SimulationSnapshot + ObserverState + CorrectionProfile
    -> AstronomyProvider
    -> TaggedCelestialVector | TaggedHorizontalDirection | AstronomicalEvent

TaggedCelestialVector
    frame: EQJ | EQD_TRUE | ECL_J2000 | ECT_TRUE
    origin: geocenter | topocenter | heliocenter | barycenter
    units: AU | unitless
    instantUtc
    corrections: lightTime, aberration, parallax, nutation, refraction
    provider: astronomy-engine@exact-version

TaggedHorizontalDirection
    east, north, up
    unitless and normalized
    horizon: geodetic-geometric | refracted-apparent
    observerRevision, timeRevision, provenance
```

Current and target wrapper rules:

1. No untagged numeric vector crosses the provider boundary.
2. Degrees, radians, sidereal hours, AU, meters, and unit vectors are distinct at the type and test
   boundary.
3. A correction is never implied by a generic name such as `apparent` without an enumerated
   profile.
4. Current factories reject non-finite/impossible observer and instant values; current runtime
   boundaries reject unsupported correction and mean-pole frame contracts. Snapshot mismatch
   rejection is not yet implemented.
5. **Milestone 2A target:** all calculations in one scene update consume the same immutable
   simulation snapshot.
6. **Milestone 2A target:** results are cached by observer revision, time revision, body, frame,
   model, provider version, and correction profile, never by render frame alone.

## Comparison with credible alternatives

### IAU SOFA

SOFA is the standards-aligned reference for precession-nutation, Earth attitude, time scales,
geodesy, and vector/matrix operations. It is the strongest validation implementation, but the
official distributions are C and Fortran and its custom license has attribution/naming
requirements. Porting or compiling it into the browser would add integration and maintenance
cost without supplying Astronomy Engine's compact application-level body/event API.

**Decision:** use SOFA offline for fixtures and frame validation; do not make it the initial
browser dependency.

### USNO NOVAS and JPL Horizons

NOVAS is a credible high-quality astrometry implementation but depends on native code and, for
many uses, substantial ephemeris data. JPL Horizons is an authoritative online ephemeris service,
not a deterministic offline browser library. Both are excellent independent comparison sources.

**Decision:** use them as bounded reference evidence, not production runtime services.

## Adoption gates and disposition

Milestone 2A0 evaluated the gates as follows:

1. **PASS:** exact package/version and MIT license are recorded.
2. **PASS:** ESM/types/build work with no added transitive package; no unrelated dependency changed.
3. **PASS:** fixed Sun and Moon cases pass predeclared JPL Horizons tolerances.
4. **PASS for the implemented path:** provider azimuth/altitude to canonical ENU and separate
   `(east, up, -north)` presentation mapping pass basis tests. The adapter uses `EQD_TRUE` rather
   than disguising it as `EQJ`.
5. **PASS for naming and JPL comparison:** true `EQD` is tagged and tested. A broader SOFA/NOVAS
   true-frame corpus remains a Tier 2 gate.
6. **PASS:** the direct P03 precession-only provider reproduces SOFA evidence; no decorative or
   nutation-inclusive fallback exists.
7. **PASS:** `UTC_APPROXIMATES_UT1`, TT, and the Espenak-Meeus delta-T policy are explicit.
8. **PASS for this non-visual spike:** production build passes and remains unchanged because the
   modules are not imported by the application entry point. Physical performance remains a later
   visible-feature check.

Astronomy Engine adoption is therefore **validated for the named Tier 1 adapter operations**.
Every new body, event, frame, refraction mode, or precision promotion still requires a bounded
profile and independent fixture review.
