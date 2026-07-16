# Astronomy Engine Evaluation

Research claims in this evaluation trace to the [official astronomy source
register](OFFICIAL_ASTRONOMY_SOURCES.md).

## Decision

**Recommendation: adopt Astronomy Engine with validation wrappers.**

The evaluated package metadata reports `astronomy-engine` `2.1.19`, Donald Cross as author, MIT
licensing, ESM and TypeScript declarations, and no side effects. No package was installed during
this architecture task. The exact version must be rechecked and pinned when implementation is
authorized.

Astronomy Engine is recommended for browser-level ephemerides, observer-relative Sun/Moon/planet
positions, supported event searches, and its documented coordinate transforms. It is not the sole
authority for Earth orientation, a precession-only mean pole, long-term precession trajectories,
UT1, polar motion, or a combined product accuracy claim.

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
| JavaScript/TypeScript | Browser and Node builds plus declarations | Compatible with Vite/static hosting | Bundle impact must be measured on Quest after installation |
| Browser/static hosting | Explicitly supported, no server required | Compatible with GitHub Pages | No online astronomy service should be needed at runtime |
| License | MIT | Acceptable in principle | Preserve notice and record exact dependency version |
| Deterministic tests | Library is deterministic for fixed inputs; upstream describes cross-language/reference validation | Offline test fixtures | Project tests must not depend on current time or live network responses |

## Why the recommendation is not unqualified adoption

### 1. Pole-model gap

The public frame list distinguishes J2000 mean equator (`EQJ`) from true equator of date (`EQD`).
It does not document a mean-equator-of-date transform that cleanly exposes precession without
nutation. A long-term precession path needs the precession-only axis; sampling `EQD` would mix
nutation into that path and violate the product requirement.

`RotationAxis(Body.Earth, time)` is documented as a body rotational-elements calculation in
J2000 coordinates. It must not be assumed to be the IAU 2006 mean pole or the IAU 2006/2000A
Celestial Intermediate Pole. The first implementation task must prove its semantics or reject it
for this purpose.

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

## Proposed adapter boundary

This is a contract proposal, not code:

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

Wrapper rules:

1. No untagged numeric vector crosses the provider boundary.
2. Degrees, radians, sidereal hours, AU, meters, and unit vectors are distinct at the type and test
   boundary.
3. A correction is never implied by a generic name such as `apparent` without an enumerated
   profile.
4. The wrapper rejects non-finite values, impossible observer inputs, mismatched timestamps, and
   unknown frame tags.
5. All calculations in one scene update consume the same immutable simulation snapshot.
6. Provider results are cached by observer revision, time revision, body, frame, and correction
   profile, never by render frame alone.

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

## Adoption gates

Astronomy Engine may be added only in a later authorized implementation task after all of these
pass:

1. Exact version and MIT notice are recorded.
2. Clean browser bundle and TypeScript import are proven without adding unrelated dependencies.
3. Fixed observer/time Sun and Moon cases reproduce versioned Horizons fixtures within a
   predeclared per-case tolerance.
4. `EQJ -> HOR -> canonical ENU -> Three.js` basis vectors and round trips pass pure tests.
5. True `EQD` behavior is compared with SOFA/NOVAS fixtures and named accurately.
6. A precession-only mean-pole provider is either demonstrated and validated or explicitly kept
   unavailable; no fallback decorative path is allowed.
7. UT1=UTC and delta-T limitations are exposed in the precision tier.
8. Bundle size and production build remain acceptable enough to proceed to Quest measurement.

Failure of gate 6 blocks the precession-path milestone, not the use of Astronomy Engine for
Sun/Moon/planet positions.
