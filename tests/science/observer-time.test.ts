import { describe, expect, it } from 'vitest';
import { toTerrestrialTime } from '../../src/science/astronomy/astronomyEngineAdapter';
import { AstronomyContractError } from '../../src/science/astronomy/errors';
import {
  MAX_ELEVATION_METERS,
  MIN_ELEVATION_METERS,
  createObserver,
} from '../../src/science/astronomy/observer';
import { createSimulationInstant } from '../../src/science/astronomy/time';
import type { ObserverInput } from '../../src/science/astronomy/types';

describe('validated observer contract', () => {
  it.each([-90, 90])('accepts latitude boundary %s degrees', (latitudeDeg) => {
    expect(
      createObserver({
        latitudeDeg,
        longitudeDegEast: 0,
        elevationMeters: 0,
      }).latitudeDeg,
    ).toBe(latitudeDeg);
  });

  it('normalizes east-positive longitude into [-180, 180)', () => {
    expect(
      createObserver({
        latitudeDeg: 0,
        longitudeDegEast: 282.9635,
        elevationMeters: 0,
      }).longitudeDegEast,
    ).toBeCloseTo(-77.0365, 12);
    expect(
      createObserver({
        latitudeDeg: 0,
        longitudeDegEast: 180,
        elevationMeters: 0,
      }).longitudeDegEast,
    ).toBe(-180);
  });

  it('preserves explicitly east-positive and west-negative longitudes', () => {
    expect(
      createObserver({
        latitudeDeg: -33.8688,
        longitudeDegEast: 151.2093,
        elevationMeters: 58,
      }).longitudeDegEast,
    ).toBeCloseTo(151.2093, 12);
    expect(
      createObserver({
        latitudeDeg: 38.8977,
        longitudeDegEast: -77.0365,
        elevationMeters: 17,
      }).longitudeDegEast,
    ).toBeCloseTo(-77.0365, 12);
  });

  it('accepts legitimate negative elevation and explicit uncertainty', () => {
    const observer = createObserver({
      latitudeDeg: 31.5,
      longitudeDegEast: 35.5,
      elevationMeters: -430,
      source: 'survey',
      uncertainty: { horizontalMeters: 4, verticalMeters: 8 },
    });

    expect(observer.elevationMeters).toBe(-430);
    expect(observer.horizontalDatum).toBe('WGS84');
    expect(observer.verticalDatum).toBe('MEAN_SEA_LEVEL');
    expect(observer.uncertainty).toEqual({
      horizontalMeters: 4,
      verticalMeters: 8,
    });
  });

  it.each([
    { latitudeDeg: Number.NaN, longitudeDegEast: 0, elevationMeters: 0 },
    { latitudeDeg: 91, longitudeDegEast: 0, elevationMeters: 0 },
    { latitudeDeg: 0, longitudeDegEast: Number.POSITIVE_INFINITY, elevationMeters: 0 },
    { latitudeDeg: 0, longitudeDegEast: 0, elevationMeters: Number.NaN },
    { latitudeDeg: 0, longitudeDegEast: 0, elevationMeters: MIN_ELEVATION_METERS - 1 },
    { latitudeDeg: 0, longitudeDegEast: 0, elevationMeters: MAX_ELEVATION_METERS + 1 },
  ])('rejects invalid observer input %#', (input) => {
    expect(() => createObserver(input)).toThrow(AstronomyContractError);
  });

  it.each([
    { horizontalDatum: 'NAD83' },
    { verticalDatum: 'UNDECLARED_HEIGHT' },
  ])('rejects an unknown datum tag %#', (datum) => {
    const input = {
      latitudeDeg: 0,
      longitudeDegEast: 0,
      elevationMeters: 0,
      ...datum,
    } as unknown as ObserverInput;
    expect(() => createObserver(input)).toThrow(AstronomyContractError);
  });

  it('is a stable serializable value', () => {
    const first = createObserver({
      latitudeDeg: 12.5,
      longitudeDegEast: 370,
      elevationMeters: 25,
    });
    const second = JSON.parse(JSON.stringify(first));

    expect(second).toEqual(first);
    expect(Object.isFrozen(first)).toBe(true);
  });
});

describe('simulation instant and time-scale contract', () => {
  it('canonicalizes an explicit immutable UTC instant', () => {
    const instant = createSimulationInstant(
      '2025-06-21T12:00:00+00:00',
      'frozen-test',
    );

    expect(instant).toEqual({
      utcIso: '2025-06-21T12:00:00.000Z',
      unixMilliseconds: 1_750_507_200_000,
      source: 'frozen-test',
    });
    expect(Object.isFrozen(instant)).toBe(true);
    expect(JSON.parse(JSON.stringify(instant))).toEqual(instant);
  });

  it.each(['2025-06-21T12:00:00', 'not-a-time', '']) (
    'rejects non-UTC or invalid input %s',
    (value) => {
      expect(() => createSimulationInstant(value, 'frozen-test')).toThrow(
        AstronomyContractError,
      );
    },
  );

  it('returns frozen TT provenance using the explicit Astronomy Engine policy', () => {
    const instant = createSimulationInstant(
      '2025-06-21T16:00:00.000Z',
      'frozen-test',
    );
    const time = toTerrestrialTime(instant);

    expect(time.julianDateTt).toBeCloseTo(2_460_848.167531584, 9);
    expect(time.deltaTSeconds).toBeCloseTo(74.7288622311, 8);
    expect(time.inputScale).toBe('UTC');
    expect(time.outputScale).toBe('TT');
    expect(time.ut1Policy).toBe('UTC_APPROXIMATES_UT1');
    expect(time.deltaTModel).toBe('ASTRONOMY_ENGINE_ESPENAK_MEEUS');
    expect(Object.isFrozen(time)).toBe(true);
  });

  it('is deterministic for a repeated frozen instant', () => {
    const instant = createSimulationInstant(
      '2025-06-21T16:00:00.000Z',
      'frozen-test',
    );
    expect(toTerrestrialTime(instant)).toEqual(toTerrestrialTime(instant));
  });
});
