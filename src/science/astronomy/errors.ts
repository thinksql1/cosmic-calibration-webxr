export type AstronomyContractErrorCode =
  | 'INVALID_INSTANT'
  | 'INVALID_REVISION'
  | 'INVALID_OBSERVER'
  | 'UNSUPPORTED_VERTICAL_DATUM'
  | 'INVALID_ANGLE'
  | 'UNSUPPORTED_FRAME_CONTRACT'
  | 'UNSUPPORTED_CORRECTION_PROFILE'
  | 'PROVIDER_IDENTITY_MISMATCH'
  | 'MALFORMED_PROVIDER_RESULT'
  | 'UNSUPPORTED_PROVIDER_CAPABILITY'
  | 'INVALID_TIME_ZONE'
  | 'CIVIL_TIME_RESOLUTION_FAILURE'
  | 'TEMPORAL_PATH_FAILURE'
  | 'MEAN_POLE_OUTSIDE_VALIDATED_DOMAIN';

export interface AstronomyContractErrorContext {
  readonly operation?: string;
  readonly expected?: Readonly<Record<string, unknown>>;
  readonly actual?: Readonly<Record<string, unknown>>;
  readonly mismatchedFields?: readonly string[];
  /**
   * Detached diagnostic data for a bounded scientific operation. Callers must
   * never place provider implementations, browser objects, or mutable errors
   * here.
   */
  readonly details?: Readonly<Record<string, unknown>>;
  /** Preserves the specific lower-layer code when an operation adds context. */
  readonly underlyingCode?: AstronomyContractErrorCode;
}

function immutableDiagnostic<T>(value: T): T {
  if (Array.isArray(value)) {
    return Object.freeze(value.map((entry) => immutableDiagnostic(entry))) as T;
  }
  if (typeof value === 'object' && value !== null) {
    return Object.freeze(Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        immutableDiagnostic(entry),
      ]),
    )) as T;
  }
  return value;
}

export class AstronomyContractError extends Error {
  readonly code: AstronomyContractErrorCode;
  readonly context?: AstronomyContractErrorContext;

  constructor(
    code: AstronomyContractErrorCode,
    message: string,
    context?: AstronomyContractErrorContext,
  ) {
    super(message);
    this.name = 'AstronomyContractError';
    this.code = code;
    this.context = context === undefined ? undefined : immutableDiagnostic(context);
    Object.freeze(this);
  }

  toJSON(): Readonly<Record<string, unknown>> {
    return Object.freeze({
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
    });
  }
}
