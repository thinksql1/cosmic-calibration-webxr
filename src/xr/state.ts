export type XRStateKind =
  | 'insecure-context'
  | 'api-unavailable'
  | 'checking'
  | 'supported'
  | 'unsupported'
  | 'check-failed'
  | 'session-starting'
  | 'session-active'
  | 'session-ended'
  | 'session-denied-or-failed';

export interface XRState {
  kind: XRStateKind;
  message: string;
  detail?: string;
}

export interface XRCapabilityApi {
  isSessionSupported(mode: 'immersive-ar'): Promise<boolean>;
}

export interface CapabilityEnvironment {
  isSecureContext: boolean;
  xr?: XRCapabilityApi;
}

export const checkingState: XRState = {
  kind: 'checking',
  message: 'Checking immersive AR availability…',
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function detectImmersiveAr(
  environment: CapabilityEnvironment,
): Promise<XRState> {
  if (!environment.isSecureContext) {
    return {
      kind: 'insecure-context',
      message: 'A secure context is required for WebXR.',
      detail: 'Open this site over HTTPS or from localhost for development.',
    };
  }

  if (!environment.xr) {
    return {
      kind: 'api-unavailable',
      message: 'This browser does not expose the WebXR API.',
      detail: 'The desktop reference scene remains available.',
    };
  }

  try {
    const supported = await environment.xr.isSessionSupported('immersive-ar');
    return supported
      ? {
          kind: 'supported',
          message: 'Immersive AR is available.',
          detail: 'Enter AR to request a floor-relative session.',
        }
      : {
          kind: 'unsupported',
          message: 'Immersive AR is not supported in this browser.',
          detail: 'The desktop reference scene remains available.',
        };
  } catch (error) {
    return {
      kind: 'check-failed',
      message: 'The immersive AR capability check failed.',
      detail: errorMessage(error),
    };
  }
}

export interface ImmersiveArSession {
  addEventListener(
    type: 'end',
    listener: () => void,
    options?: { once?: boolean },
  ): void;
}

export interface XRSessionApi {
  requestSession(
    mode: 'immersive-ar',
    options: XRSessionInit,
  ): Promise<ImmersiveArSession>;
}

export type SessionBinder = (session: ImmersiveArSession) => Promise<void>;
export type StateListener = (state: XRState) => void;

export class ImmersiveArSessionController {
  private activeSession?: ImmersiveArSession;
  private requestPending = false;

  constructor(
    private readonly xr: XRSessionApi,
    private readonly bindSession: SessionBinder,
    private readonly onState: StateListener,
  ) {}

  async start(): Promise<void> {
    if (this.requestPending || this.activeSession) return;

    this.requestPending = true;
    this.onState({
      kind: 'session-starting',
      message: 'Requesting an immersive AR session…',
      detail: 'A floor-relative reference space is required.',
    });

    try {
      const session = await this.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor'],
      });
      await this.bindSession(session);
      this.activeSession = session;
      session.addEventListener('end', this.handleSessionEnd, { once: true });
      this.onState({
        kind: 'session-active',
        message: 'Immersive AR session active.',
        detail: 'Floor placement and passthrough still require physical Quest verification.',
      });
    } catch (error) {
      this.onState({
        kind: 'session-denied-or-failed',
        message: 'The immersive AR session was denied or could not start.',
        detail: errorMessage(error),
      });
    } finally {
      this.requestPending = false;
    }
  }

  private readonly handleSessionEnd = (): void => {
    this.activeSession = undefined;
    this.onState({
      kind: 'session-ended',
      message: 'Immersive AR session ended.',
      detail: 'The desktop reference scene is active again.',
    });
  };
}
