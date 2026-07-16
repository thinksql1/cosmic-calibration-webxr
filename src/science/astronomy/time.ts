import { AstronomyContractError } from './errors';
import type {
  SimulationInstant,
  SimulationInstantSource,
} from './types';

const UTC_DESIGNATOR = /(Z|[+-]00:00)$/i;

export function createSimulationInstant(
  utcIso: string,
  source: SimulationInstantSource,
): SimulationInstant {
  if (!UTC_DESIGNATOR.test(utcIso)) {
    throw new AstronomyContractError(
      'INVALID_INSTANT',
      'Simulation instants must declare UTC with Z or +00:00.',
    );
  }

  const unixMilliseconds = Date.parse(utcIso);
  if (!Number.isFinite(unixMilliseconds)) {
    throw new AstronomyContractError(
      'INVALID_INSTANT',
      'Simulation instant is not a valid UTC timestamp.',
    );
  }

  return Object.freeze({
    utcIso: new Date(unixMilliseconds).toISOString(),
    unixMilliseconds,
    source,
  });
}
