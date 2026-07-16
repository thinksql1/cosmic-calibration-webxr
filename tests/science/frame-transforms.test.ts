import { describe, expect, it } from 'vitest';
import { mapEnuToApplicationBasis } from '../../src/presentation/mapEnuToApplicationBasis';
import { AstronomyContractError } from '../../src/science/astronomy/errors';
import {
  degreesToRadians,
  horizontalAnglesToEnu,
  radiansToDegrees,
} from '../../src/science/astronomy/frameTransforms';

const basisCases = [
  ['north horizon', 0, 0, [0, 1, 0]],
  ['east horizon', 90, 0, [1, 0, 0]],
  ['south horizon', 180, 0, [0, -1, 0]],
  ['west horizon', 270, 0, [-1, 0, 0]],
  ['zenith', 0, 90, [0, 0, 1]],
  ['nadir', 0, -90, [0, 0, -1]],
] as const;

describe('horizontal azimuth/altitude to canonical ENU', () => {
  it.each(basisCases)(
    'maps %s correctly',
    (_name, azimuthDeg, altitudeDeg, expected) => {
      const direction = horizontalAnglesToEnu(azimuthDeg, altitudeDeg);

      expect(direction.frame).toBe('HORIZONTAL_ENU');
      expect(direction.east).toBeCloseTo(expected[0], 14);
      expect(direction.north).toBeCloseTo(expected[1], 14);
      expect(direction.up).toBeCloseTo(expected[2], 14);
      expect(
        Math.hypot(direction.east, direction.north, direction.up),
      ).toBeCloseTo(1, 14);
    },
  );

  it('maps a representative diagonal to equal ENU components', () => {
    const direction = horizontalAnglesToEnu(45, 35.264389682754654);
    const component = 1 / Math.sqrt(3);

    expect(direction.east).toBeCloseTo(component, 14);
    expect(direction.north).toBeCloseTo(component, 14);
    expect(direction.up).toBeCloseTo(component, 14);
  });

  it('normalizes azimuth without changing direction', () => {
    expect(horizontalAnglesToEnu(-90, 0)).toEqual(
      horizontalAnglesToEnu(270, 0),
    );
  });

  it.each([
    [Number.NaN, 0],
    [0, Number.POSITIVE_INFINITY],
    [0, 90.0001],
    [0, -90.0001],
  ])('rejects invalid angles (%s, %s)', (azimuth, altitude) => {
    expect(() => horizontalAnglesToEnu(azimuth, altitude)).toThrow(
      AstronomyContractError,
    );
  });

  it('makes degree/radian conversion explicit', () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 15);
    expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90, 15);
    expect(() => degreesToRadians(Number.NaN)).toThrow(AstronomyContractError);
    expect(() => radiansToDegrees(Number.NaN)).toThrow(AstronomyContractError);
  });
});

describe('presentation basis mapping', () => {
  it('maps ENU east/up/north to +X/+Y/-Z outside the science adapter', () => {
    const direction = horizontalAnglesToEnu(45, 35.264389682754654);
    const mapped = mapEnuToApplicationBasis(direction);

    expect(mapped).toEqual({
      frame: 'APPLICATION_BASIS',
      units: 'unitless',
      x: direction.east,
      y: direction.up,
      z: -direction.north,
    });
  });
});
