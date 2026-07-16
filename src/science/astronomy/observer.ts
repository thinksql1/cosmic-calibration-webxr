import { AstronomyContractError } from './errors';
import type {
  ObserverInput,
  ObserverUncertainty,
  ValidatedObserver,
} from './types';

export const MIN_ELEVATION_METERS = -12_000;
export const MAX_ELEVATION_METERS = 100_000;

function normalizeLongitude(longitudeDegEast: number): number {
  const normalized =
    ((longitudeDegEast + 180) % 360 + 360) % 360 - 180;
  return Object.is(normalized, -0) ? 0 : normalized;
}

function validateUncertainty(
  uncertainty: ObserverUncertainty | undefined,
): ObserverUncertainty | undefined {
  if (!uncertainty) return undefined;

  for (const [name, value] of Object.entries(uncertainty)) {
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
      throw new AstronomyContractError(
        'INVALID_OBSERVER',
        `${name} uncertainty must be a finite, non-negative number.`,
      );
    }
  }

  return Object.freeze({ ...uncertainty });
}

export function createObserver(input: ObserverInput): ValidatedObserver {
  const { latitudeDeg, longitudeDegEast, elevationMeters } = input;

  if (
    input.horizontalDatum !== undefined &&
    input.horizontalDatum !== 'WGS84'
  ) {
    throw new AstronomyContractError(
      'INVALID_OBSERVER',
      'The initial horizontal datum must be WGS84.',
    );
  }

  if (
    input.verticalDatum !== undefined &&
    input.verticalDatum !== 'MEAN_SEA_LEVEL' &&
    input.verticalDatum !== 'WGS84_ELLIPSOID'
  ) {
    throw new AstronomyContractError(
      'INVALID_OBSERVER',
      'Vertical datum must be MEAN_SEA_LEVEL or WGS84_ELLIPSOID.',
    );
  }

  if (
    !Number.isFinite(latitudeDeg) ||
    latitudeDeg < -90 ||
    latitudeDeg > 90
  ) {
    throw new AstronomyContractError(
      'INVALID_OBSERVER',
      'Geodetic latitude must be finite and within [-90, +90] degrees.',
    );
  }

  if (!Number.isFinite(longitudeDegEast)) {
    throw new AstronomyContractError(
      'INVALID_OBSERVER',
      'East-positive longitude must be finite.',
    );
  }

  if (
    !Number.isFinite(elevationMeters) ||
    elevationMeters < MIN_ELEVATION_METERS ||
    elevationMeters > MAX_ELEVATION_METERS
  ) {
    throw new AstronomyContractError(
      'INVALID_OBSERVER',
      `Elevation must be finite and within the application sanity range [${MIN_ELEVATION_METERS}, ${MAX_ELEVATION_METERS}] meters.`,
    );
  }

  return Object.freeze({
    kind: 'VALIDATED_OBSERVER',
    latitudeDeg,
    longitudeDegEast: normalizeLongitude(longitudeDegEast),
    elevationMeters,
    horizontalDatum: input.horizontalDatum ?? 'WGS84',
    verticalDatum: input.verticalDatum ?? 'MEAN_SEA_LEVEL',
    ...(input.source === undefined ? {} : { source: input.source }),
    ...(input.uncertainty === undefined
      ? {}
      : { uncertainty: validateUncertainty(input.uncertainty) }),
  });
}
