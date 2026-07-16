# Official Astronomy Sources

**Research date:** 2026-07-16

## Purpose and evidence classes

This register records the primary and official sources used to define Milestone 2. It is not a
general astronomy bibliography. Sources are classified as:

- **Normative:** an adopted standard or convention.
- **Reference implementation:** software or data suitable for independent comparison.
- **Implementation-oriented:** an application library being evaluated for runtime use.
- **Operational data:** time-varying authoritative data that may be needed by a higher precision
  tier.
- **Educational/explanatory:** an authoritative explanation that clarifies terminology without
  replacing a standard.
- **Primary research:** a peer-reviewed model not automatically adopted as an IAU standard.

The architecture phase copied no source or formula into the repository. Milestone 2A0 later added
an application implementation of the published P03 equations and frozen numerical fixtures, with
the exact provenance and license boundaries recorded below. No SOFA source file, JPL ephemeris,
or live astronomy service is part of the runtime. These notes are not legal advice.

## Source register

| Source | Authority / version | Class | Relevant capability | Important limitation | License implication |
|---|---|---|---|---|---|
| [Astronomy Engine repository and overview](https://github.com/cosinekitty/astronomy) | Donald Cross / `cosinekitty`; repository inspected 2026-07-16 | Implementation-oriented | Browser and Node JavaScript/TypeScript; Sun, Moon, planets, vectors, horizontal coordinates, events, and stated validation against NOVAS and JPL Horizons | A compact application library, not an IAU/IERS reference implementation; its stated ephemeris design target cannot be treated as the whole XR error budget | [MIT upstream license at `v2.1.19`](https://github.com/cosinekitty/astronomy/blob/v2.1.19/LICENSE); installed `2.1.19` declares MIT in package metadata but its tarball has no standalone license file, so this notice must be preserved when provider code is distributed |
| [npm `astronomy-engine@2.1.19`](https://www.npmjs.com/package/astronomy-engine/v/2.1.19) and [tagged source package metadata](https://github.com/cosinekitty/astronomy/blob/v2.1.19/source/js/package.json) | Donald Cross; registry and tag metadata verified 2026-07-16 | Implementation-oriented / package metadata | Confirms exact name/version, CommonJS `main`, ESM `module`, TypeScript `types`, conditional exports, browser/minified files, and `sideEffects: false`; no runtime package dependencies are declared | Package metadata proves distribution shape, not scientific semantics | MIT; exact version is pinned in `package.json` and `package-lock.json` |
| [Astronomy Engine `2.1.19` TypeScript declarations](https://raw.githubusercontent.com/cosinekitty/astronomy/v2.1.19/source/js/astronomy.d.ts) | Donald Cross; exact installed declaration source | Implementation-oriented | Documents topocentric `Equator`, true-of-date precession/nutation, optional aberration, `Horizon` azimuth/altitude, east-positive observer longitude, MSL height, `AstroTime` UT/TT, and refraction modes | `EQD` is true, not precession-only mean; `AstroTime` approximates UT1 and UTC as equal | MIT; declarations are consumed from the installed package |
| [Astronomy Engine release history](https://github.com/cosinekitty/astronomy/releases/tag/v2.1.19) | Donald Cross; release `v2.1.19` | Implementation-oriented | Confirms the package export/type correction associated with the pinned release | Release notes are implementation claims, not independent scientific validation | MIT; exact behavior is frozen by project adapter tests |
| [IAU SOFA current software](https://www.iausofa.org/current-software) and [ANSI C issue page](https://www.iausofa.org/2023-10-11c) | IAU Standards of Fundamental Astronomy Board; Issue 2023-10-11, release 19 | Normative implementation / reference implementation | IAU 2006 precession separately from IAU 2000A nutation, `pmat06` GCRS-to-mean-date bias-precession direction, TT two-part JD, time-scale transformations, and published validation programs | Official distributions are C and Fortran, not a browser TypeScript package; SOFA is used only offline as the validation authority | [SOFA's own license](https://www.iausofa.org/terms-and-conditions) has attribution, naming, and non-endorsement conditions. No SOFA source file is copied or shipped; the project implementation cites the published P03 model and states it is not SOFA software |
| [SOFA Cookbooks](https://www.iausofa.org/cookbooks) | IAU SOFA Board | Normative explanatory / reference implementation | Earth attitude, astrometry, vector/matrix operations, UTC/UT1/TT and leap-second handling | Cookbooks explain standards but do not supply project-specific WebXR mappings | Reference and cite; comply with SOFA terms if code is derived |
| [IERS Conventions (2010), Technical Note 36](https://iers-conventions.obspm.fr/content/tn36.pdf) | International Earth Rotation and Reference Systems Service; official 2010 edition | Normative | ITRS/GCRS transformation, the `Q(t) R(t) W(t)` separation, CIP, Earth rotation, polar motion, and terrestrial reference frames | Operational realization needs Earth Orientation Parameters; updated web chapters are explicitly under development unless incorporated into an official edition | Use as a cited standard; no IERS routine or table is copied in this task |
| [IERS Chapter 5: ITRS to GCRS](https://iers-conventions.obspm.fr/content/chapter5/icc5.pdf) | IERS Conventions Centre; updated chapter viewed 2026-07-16 | Normative-development supplement | Shows celestial-pole motion, Earth rotation, and polar motion as distinct transforms; defines CIRS/TIRS relationships | The site warns that updated chapters are not themselves a registered definitive edition | Use the official 2010 edition as normative and the update only as a tracked supplement |
| [IERS Bulletins](https://data.iers.org/bulletins.php) | IERS | Operational data | Bulletin A/B provide UT1-UTC, polar motion, celestial-pole offsets, uncertainties, and predictions; Bulletin C announces leap seconds | Network data are mutable, may be provisional, and create availability/provenance obligations | Tier 3 only unless a versioned offline fixture is deliberately captured and attributed |
| [IAU 2006 Resolution 1](https://syrte.obspm.fr/iauJD16/IAU2006_Resol1.pdf) | International Astronomical Union; Resolution 1, 2006 | Normative | Adopts P03 precession and distinguishes precession of the equator from precession of the ecliptic | The resolution does not provide an application-ready WebXR transform or a long-cycle rendering contract | Cite the resolution and the referenced model; no code license is implied |
| [Expressions for IAU 2000 precession quantities](https://syrte.obspm.fr/iau2006/aa03_412_P03.pdf) | N. Capitaine, P. T. Wallace, J. Chapront; Astronomy & Astrophysics 412, 2003 | Primary research / standards basis | Defines the P03 precession expressions later adopted through IAU 2006 Resolution B1 and separates equator and ecliptic precession quantities | Polynomial validity and reference-frame details must be respected; it is not by itself a browser implementation or proof of full-cycle suitability | Cite the paper; formula/code implementation and validation require separate review |
| [USNO Circular 179](https://aa.usno.navy.mil/downloads/Circular_179.pdf) | G. H. Kaplan, U.S. Naval Observatory, 2005 | Authoritative educational / implementation reference | Explains IAU 2000 precession-nutation, mean versus true pole/equator, CIP, Earth rotation, and vector/matrix formulations | Predates final IAU 2006 adoption in places; current IAU/SOFA/IERS standards take precedence | Reference material only |
| [NOVAS C 3.1 User's Guide](https://aa.usno.navy.mil/downloads/novas/NOVAS_C3.1_Guide.pdf) | U.S. Naval Observatory; NOVAS C 3.1 guide | Reference implementation | Defines astrometric, apparent, local, and topocentric place; provides a credible comparison implementation | Requires native code and ephemeris resources unsuitable for the current static browser target | Use offline as an independent reference; do not make it a browser dependency |
| [JPL Horizons System Manual](https://ssd.jpl.nasa.gov/horizons/manual.html) and [Horizons API documentation](https://ssd-api.jpl.nasa.gov/doc/horizons.html) | NASA/JPL Solar System Dynamics; manual version 4.98d, API documentation version 1.3, fixture responses API 1.2, queried 2026-07-16 | Reference data/service | DE441 observer tables, airless apparent RA/declination and azimuth/elevation, north-zero/east-positive azimuth, selectable UT, geodetic user sites with reference-ellipsoid height, and exact query reproducibility | Online service, EOP/model choices and response API signatures vary; its ellipsoid height is not Astronomy Engine's mean-sea-level height | Three bounded fixture responses are transcribed with exact URLs/settings/values, both height-datum tags, and attribution; no JPL code or ephemeris is shipped |
| [NGA World Geodetic System 1984](https://earth-info.nga.mil/?action=wgs84&dir=wgs84) | U.S. National Geospatial-Intelligence Agency | Normative geodetic reference | Defines the practical global reference ellipsoid and geodetic latitude, longitude, and height basis | Astronomy Engine's documented observer height is above mean sea level, which is not automatically WGS 84 ellipsoidal height | Record the input datum and height type; never silently mix ellipsoidal and orthometric height |
| [W3C Geolocation](https://www.w3.org/TR/geolocation/) | W3C Devices and Sensors Working Group; Recommendation lineage viewed 2026-07-16 | Normative web-platform specification | Defines latitude/longitude in WGS 84 and optional altitude in meters above the WGS 84 ellipsoid, with accuracy metadata and permission/privacy requirements | Altitude may be unavailable, and ellipsoidal altitude cannot be passed as Astronomy Engine's mean-sea-level height without a declared conversion/model | Specification reference only; geolocation permission and collection remain out of scope |
| [USNO Astronomical Applications Glossary](https://aa.usno.navy.mil/faq/asa_glossary) | U.S. Naval Observatory | Authoritative educational | Defines CIP, celestial equator, geodetic coordinates, topocentric place, horizon types, polar motion, and pole terminology | A glossary clarifies names but is not an algorithm or numerical validation set | Cite terminology; standards remain authoritative |
| [IANA Time Zone Database](https://www.iana.org/time-zones) | Internet Assigned Numbers Authority; release `2026c` on 2026-07-08 at research time | Operational civil-time data | Historical and current civil offsets, time-zone boundaries, and daylight-saving rules | Political rules change; browser tzdata version is not directly controlled by the application | Prefer platform `Intl` with an IANA zone ID; if data are vendored later, review that release's terms and update policy |
| [Three.js WebXRManager documentation](https://threejs.org/docs/pages/WebXRManager.html) | Three.js maintainers; current docs viewed 2026-07-16, project runtime `0.185.1` | Official implementation-oriented documentation | Defines the renderer's WebXR bridge, reference-space selection, controller access, async session binding, and XR camera behavior; documents `local-floor` as the default reference-space type | A rendering/runtime API does not define terrestrial or celestial scientific frames; its camera and scene transforms must remain downstream of the scientific model | Three.js is MIT; no Three.js package or version changed in this task |
| [WebXR Device API](https://www.w3.org/TR/webxr/) | W3C Immersive Web Working Group; Candidate Recommendation Draft 2026-06-09 | Normative web-platform draft | Defines `local-floor`, `+X` right / `+Y` up / `-Z` forward, and reference-space `reset` discontinuities | Candidate Recommendation work can change; actual Quest support remains device evidence | Specification reference only under W3C document terms |
| [New precession expressions, valid for long time intervals](https://doi.org/10.1051/0004-6361/201117274) | J. Vondrák, N. Capitaine, P. Wallace; A&A 534 A22, 2011 | Primary research | Provides long-term precession expressions intended to avoid the limited-span divergence of standard polynomial precession models | It is not automatically the application's adopted standard and still has a declared validity domain; it must be independently implemented or validated | Cite the paper; do not copy article prose or figures. Formula/code licensing must be reviewed before implementation |

## Findings supported by the sources

### Confirmed facts

1. IERS separates terrestrial polar motion, Earth rotation, and celestial pole motion. They are
   not one generic orientation correction.
2. In standards terminology, the Celestial Intermediate Pole is a specific precession-nutation
   model pole, not a synonym for every possible physical or mean pole.
3. A mean pole/equator is precession-only; a true pole/equator includes nutation. Observational
   celestial-pole offsets are another layer.
4. Astronomy Engine's horizontal vector convention is `x = north`, `y = west`, `z = zenith`,
   while traditional azimuth is clockwise from north toward east.
5. Astronomy Engine `EQD` is true equator of date, including precession and nutation. Its public
   reference does not document a separate mean-equator-of-date orientation.
6. Astronomy Engine approximates UT1 and UTC as equal and derives TT using its internal delta-T
   model. Full EOP-aware work therefore needs a different tier.
7. A `local-floor` WebXR reference space establishes a device floor and local vertical, not a
   geodetic or astronomical horizon. A reference-space `reset` can signal a discontinuity that
   invalidates room-to-geographic calibration.
8. Civil-time rules are versioned political data. UTC astronomical computation and IANA-zone
   label generation must remain separate.
9. The exact `2.1.19` adapter matches three DE441 airless topocentric fixtures within the
   predeclared `0.02 degrees` tolerance; this validates only those named operations.
10. P03 bias-precession can be implemented independently with the documented
    `V(mean-date) = M * V(GCRS)` contract. The third row of `M` is the mean-date north axis in
    GCRS; south is its exact negative.

### Architecture recommendations derived from those facts

- Use Astronomy Engine at the application level only behind a typed, testable adapter.
- Treat SOFA/IERS as the standards reference and JPL Horizons/NOVAS as independent comparison
  evidence, not browser runtime dependencies.
- Preserve the passing dedicated P03 mean-pole proof; a long-term path still requires its own
  model/date-domain proof rather than extrapolating the bounded provider.
- Preserve a separate optional true/CIP-like pole layer and still separate polar motion,
  Chandler wobble, and observed celestial-pole offsets.
- Keep all source frame, observer, time, correction, and provenance metadata attached to
  scientific results until the final display-only conversion.

## Open source/version controls

- Keep `astronomy-engine` pinned to `2.1.19` until an explicit provider-version scientific change
  compares the fixture corpus and license/package delta. Never replace it with an unreviewed
  floating latest version.
- Pin golden fixtures to exact source versions, query parameters, observer coordinates, time
  scales, correction flags, and retrieval date.
- A future source update is an explicit scientific change requiring regression comparison, not a
  routine lockfile refresh.
