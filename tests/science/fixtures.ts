import type { ObserverInput } from '../../src/science/astronomy/types';

export interface HorizonsFixture {
  readonly id: string;
  readonly body: 'Sun' | 'Moon';
  readonly instantUtc: string;
  readonly observer: ObserverInput;
  readonly expected: {
    readonly rightAscensionDeg: number;
    readonly declinationDeg: number;
    readonly azimuthDeg: number;
    readonly altitudeDeg: number;
  };
  readonly toleranceDeg: number;
  readonly source: {
    readonly authority: 'NASA/JPL Horizons';
    readonly apiVersion: '1.2';
    readonly ephemeris: 'DE441';
    readonly queryUrl: string;
    readonly settings: string;
    readonly printedResolutionDeg: {
      readonly equatorial: 0.00001;
      readonly horizontal: 0.000001;
    };
    readonly horizonsHeightDatum: 'REFERENCE_ELLIPSOID';
    readonly adapterHeightDatum: 'MEAN_SEA_LEVEL';
    readonly heightComparisonPolicy: 'SAME_NUMERIC_HEIGHT_NO_GEOID_CONVERSION';
    readonly retrievedUtc: '2026-07-16';
  };
}

const HORIZONS_SETTINGS =
  'OBSERVER, coord@399, geodetic east-positive longitude/latitude/reference-ellipsoid-altitude-km, TIME_TYPE=UT, REF_SYSTEM=ICRF, QUANTITIES=2,4, APPARENT=AIRLESS, ANG_FORMAT=DEG';

const HEIGHT_COMPARISON = Object.freeze({
  horizonsHeightDatum: 'REFERENCE_ELLIPSOID',
  adapterHeightDatum: 'MEAN_SEA_LEVEL',
  heightComparisonPolicy: 'SAME_NUMERIC_HEIGHT_NO_GEOID_CONVERSION',
} as const);

const PRINTED_RESOLUTION = Object.freeze({
  equatorial: 0.00001,
  horizontal: 0.000001,
} as const);

export const HORIZONS_FIXTURES: readonly HorizonsFixture[] = Object.freeze([
  {
    id: 'JPL-DE441-SUN-WASHINGTON-SOLSTICE-DATE',
    body: 'Sun',
    instantUtc: '2025-06-21T16:00:00.000Z',
    observer: {
      latitudeDeg: 38.8977,
      longitudeDegEast: -77.0365,
      elevationMeters: 17,
      horizontalDatum: 'WGS84',
      verticalDatum: 'MEAN_SEA_LEVEL',
      source: 'JPL fixture site',
    },
    expected: {
      rightAscensionDeg: 90.57705,
      declinationDeg: 23.43661,
      azimuthDeg: 130.989637,
      altitudeDeg: 68.547822,
    },
    toleranceDeg: 0.02,
    source: {
      authority: 'NASA/JPL Horizons',
      apiVersion: '1.2',
      ephemeris: 'DE441',
      queryUrl:
        "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='10'&OBJ_DATA=NO&MAKE_EPHEM=YES&EPHEM_TYPE=OBSERVER&CENTER='coord@399'&COORD_TYPE=GEODETIC&SITE_COORD='-77.0365,38.8977,0.017'&START_TIME='2025-06-21%2016:00'&STOP_TIME='2025-06-21%2016:01'&STEP_SIZE='1%20m'&QUANTITIES='2,4'&REF_SYSTEM=ICRF&CAL_FORMAT=CAL&TIME_DIGITS=SECONDS&TIME_TYPE=UT&ANG_FORMAT=DEG&APPARENT=AIRLESS&CSV_FORMAT=YES",
      settings: HORIZONS_SETTINGS,
      printedResolutionDeg: PRINTED_RESOLUTION,
      ...HEIGHT_COMPARISON,
      retrievedUtc: '2026-07-16',
    },
  },
  {
    id: 'JPL-DE441-MOON-SYDNEY-BELOW-HORIZON',
    body: 'Moon',
    instantUtc: '2025-10-15T10:00:00.000Z',
    observer: {
      latitudeDeg: -33.8688,
      longitudeDegEast: 151.2093,
      elevationMeters: 58,
      horizontalDatum: 'WGS84',
      verticalDatum: 'MEAN_SEA_LEVEL',
      source: 'JPL fixture site',
    },
    expected: {
      rightAscensionDeg: 136.29187,
      declinationDeg: 20.07641,
      azimuthDeg: 147.319189,
      altitudeDeg: -74.014111,
    },
    toleranceDeg: 0.02,
    source: {
      authority: 'NASA/JPL Horizons',
      apiVersion: '1.2',
      ephemeris: 'DE441',
      queryUrl:
        "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='301'&OBJ_DATA=NO&MAKE_EPHEM=YES&EPHEM_TYPE=OBSERVER&CENTER='coord@399'&COORD_TYPE=GEODETIC&SITE_COORD='151.2093,-33.8688,0.058'&START_TIME='2025-10-15%2010:00'&STOP_TIME='2025-10-15%2010:01'&STEP_SIZE='1%20m'&QUANTITIES='2,4'&REF_SYSTEM=ICRF&CAL_FORMAT=CAL&TIME_DIGITS=SECONDS&TIME_TYPE=UT&ANG_FORMAT=DEG&APPARENT=AIRLESS&CSV_FORMAT=YES",
      settings: HORIZONS_SETTINGS,
      printedResolutionDeg: PRINTED_RESOLUTION,
      ...HEIGHT_COMPARISON,
      retrievedUtc: '2026-07-16',
    },
  },
  {
    id: 'JPL-DE441-SUN-EQUATOR-EQUINOX-DATE-BELOW-HORIZON',
    body: 'Sun',
    instantUtc: '2025-03-20T00:00:00.000Z',
    observer: {
      latitudeDeg: 0,
      longitudeDegEast: 0,
      elevationMeters: 0,
      horizontalDatum: 'WGS84',
      verticalDatum: 'MEAN_SEA_LEVEL',
      source: 'JPL fixture site',
    },
    expected: {
      rightAscensionDeg: 359.6571,
      declinationDeg: -0.14879,
      azimuthDeg: 265.466087,
      altitudeDeg: -88.117391,
    },
    toleranceDeg: 0.02,
    source: {
      authority: 'NASA/JPL Horizons',
      apiVersion: '1.2',
      ephemeris: 'DE441',
      queryUrl:
        "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='10'&OBJ_DATA=NO&MAKE_EPHEM=YES&EPHEM_TYPE=OBSERVER&CENTER='coord@399'&COORD_TYPE=GEODETIC&SITE_COORD='0,0,0'&START_TIME='2025-03-20%2000:00'&STOP_TIME='2025-03-20%2000:01'&STEP_SIZE='1%20m'&QUANTITIES='2,4'&REF_SYSTEM=ICRF&CAL_FORMAT=CAL&TIME_DIGITS=SECONDS&TIME_TYPE=UT&ANG_FORMAT=DEG&APPARENT=AIRLESS&CSV_FORMAT=YES",
      settings: HORIZONS_SETTINGS,
      printedResolutionDeg: PRINTED_RESOLUTION,
      ...HEIGHT_COMPARISON,
      retrievedUtc: '2026-07-16',
    },
  },
]);

export interface P03PoleFixture {
  readonly id: string;
  readonly instantUtc: string;
  readonly julianDateTt: number;
  readonly northGcrs: readonly [number, number, number];
  readonly componentTolerance: number;
  readonly source: string;
}

export const P03_POLE_FIXTURES: readonly P03PoleFixture[] = Object.freeze([
  {
    id: 'SOFA-PMAT06-PUBLISHED-1996',
    instantUtc: '1996-02-10T23:58:49.716Z',
    julianDateTt: 2_450_124.4999,
    northGcrs: [
      -0.00037797349570340895,
      -0.0000001924880847894457,
      0.9999999285679972,
    ],
    componentTolerance: 1e-12,
    source:
      'IAU SOFA C release 2023-10-11 t_sofa_c iauPmat06 fixture, third row of the published GCRS-to-mean-date matrix',
  },
  {
    id: 'SOFA-P03-STANDALONE-J2000',
    instantUtc: '2000-01-01T11:58:56.152Z',
    julianDateTt: 2_451_545,
    northGcrs: [
      -0.00000008056214211620058,
      -0.00000003305943169218395,
      0.9999999999999962,
    ],
    componentTolerance: 1e-12,
    source:
      'Standalone C# translation of IAU SOFA pfw06/obl06/fw2m, first verified against the official pmat06 test matrix',
  },
  {
    id: 'SOFA-P03-STANDALONE-PRESENT',
    instantUtc: '2025-06-21T16:00:00.000Z',
    julianDateTt: 2_460_848.167531584,
    northGcrs: [
      0.002474652002445657,
      -0.000007112524952668232,
      0.9999969380187516,
    ],
    componentTolerance: 1e-12,
    source:
      'Standalone C# translation of IAU SOFA pfw06/obl06/fw2m, first verified against the official pmat06 test matrix',
  },
  {
    id: 'SOFA-P03-STANDALONE-FUTURE-ONE-CENTURY',
    instantUtc: '2100-01-01T11:56:37.345Z',
    julianDateTt: 2_488_070,
    northGcrs: [
      0.009713469471883276,
      -0.00010877752855187328,
      0.999952817226027,
    ],
    componentTolerance: 1e-12,
    source:
      'Standalone C# translation of IAU SOFA pfw06/obl06/fw2m, first verified against the official pmat06 test matrix',
  },
]);
