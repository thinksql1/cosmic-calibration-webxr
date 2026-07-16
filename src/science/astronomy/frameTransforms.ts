import { AstronomyContractError } from './errors';
import type {
  CartesianUnitDirection,
  CelestialFrameTag,
  EnuUnitDirection,
} from './types';

export const DEGREES_TO_RADIANS = Math.PI / 180;
export const RADIANS_TO_DEGREES = 180 / Math.PI;

export function degreesToRadians(degrees: number): number {
  if (!Number.isFinite(degrees)) {
    throw new AstronomyContractError(
      'INVALID_ANGLE',
      'Degree value must be finite.',
    );
  }
  return degrees * DEGREES_TO_RADIANS;
}

export function radiansToDegrees(radians: number): number {
  if (!Number.isFinite(radians)) {
    throw new AstronomyContractError(
      'INVALID_ANGLE',
      'Radian value must be finite.',
    );
  }
  return radians * RADIANS_TO_DEGREES;
}

function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

export function horizontalAnglesToEnu(
  azimuthDeg: number,
  altitudeDeg: number,
): EnuUnitDirection {
  if (
    !Number.isFinite(azimuthDeg) ||
    !Number.isFinite(altitudeDeg) ||
    altitudeDeg < -90 ||
    altitudeDeg > 90
  ) {
    throw new AstronomyContractError(
      'INVALID_ANGLE',
      'Azimuth must be finite and altitude must be within [-90, +90] degrees.',
    );
  }

  const azimuth = degreesToRadians(normalizeDegrees(azimuthDeg));
  const altitude = degreesToRadians(altitudeDeg);
  const horizontal = Math.cos(altitude);

  const east = horizontal * Math.sin(azimuth);
  const north = horizontal * Math.cos(azimuth);
  const up = Math.sin(altitude);
  const length = Math.hypot(east, north, up);

  return Object.freeze({
    frame: 'HORIZONTAL_ENU',
    units: 'unitless',
    east: east / length,
    north: north / length,
    up: up / length,
  });
}

export function normalizeCartesianDirection<Frame extends CelestialFrameTag>(
  frame: Frame,
  x: number,
  y: number,
  z: number,
): CartesianUnitDirection<Frame> {
  const length = Math.hypot(x, y, z);
  if (!Number.isFinite(length) || length === 0) {
    throw new AstronomyContractError(
      'INVALID_ANGLE',
      'Cartesian direction must contain finite, non-zero components.',
    );
  }

  return Object.freeze({
    frame,
    units: 'unitless',
    x: x / length,
    y: y / length,
    z: z / length,
  });
}

export function angularSeparationDeg(
  left: readonly [number, number, number],
  right: readonly [number, number, number],
): number {
  const leftLength = Math.hypot(...left);
  const rightLength = Math.hypot(...right);
  if (
    !Number.isFinite(leftLength) ||
    !Number.isFinite(rightLength) ||
    leftLength === 0 ||
    rightLength === 0
  ) {
    throw new AstronomyContractError(
      'INVALID_ANGLE',
      'Angular separation requires finite, non-zero vectors.',
    );
  }

  const cosine =
    (left[0] * right[0] + left[1] * right[1] + left[2] * right[2]) /
    (leftLength * rightLength);
  return Math.acos(Math.min(1, Math.max(-1, cosine))) * RADIANS_TO_DEGREES;
}
