import { describe, expect, it, vi } from 'vitest';
import {
  detectImmersiveAr,
  ImmersiveArSessionController,
  type ImmersiveArSession,
  type XRSessionApi,
  type XRState,
} from '../src/xr/state';

describe('detectImmersiveAr', () => {
  it('reports an insecure context before probing WebXR', async () => {
    const isSessionSupported = vi.fn();
    const state = await detectImmersiveAr({
      isSecureContext: false,
      xr: { isSessionSupported },
    });

    expect(state.kind).toBe('insecure-context');
    expect(isSessionSupported).not.toHaveBeenCalled();
  });

  it('reports a missing WebXR API', async () => {
    const state = await detectImmersiveAr({ isSecureContext: true });
    expect(state.kind).toBe('api-unavailable');
  });

  it('reports immersive AR support', async () => {
    const isSessionSupported = vi.fn().mockResolvedValue(true);
    const state = await detectImmersiveAr({
      isSecureContext: true,
      xr: { isSessionSupported },
    });

    expect(state.kind).toBe('supported');
    expect(isSessionSupported).toHaveBeenCalledWith('immersive-ar');
  });

  it('reports immersive AR as unsupported', async () => {
    const state = await detectImmersiveAr({
      isSecureContext: true,
      xr: { isSessionSupported: vi.fn().mockResolvedValue(false) },
    });
    expect(state.kind).toBe('unsupported');
  });

  it('maps capability-check rejection to a readable state', async () => {
    const state = await detectImmersiveAr({
      isSecureContext: true,
      xr: {
        isSessionSupported: vi.fn().mockRejectedValue(new Error('probe failed')),
      },
    });
    expect(state).toMatchObject({ kind: 'check-failed', detail: 'probe failed' });
  });
});

class FakeSession implements ImmersiveArSession {
  private endListener?: () => void;

  addEventListener(type: 'end', listener: () => void): void {
    if (type === 'end') this.endListener = listener;
  }

  end(): void {
    this.endListener?.();
  }
}

describe('ImmersiveArSessionController', () => {
  it('maps session-start failure to a readable state', async () => {
    const states: XRState[] = [];
    const xr: XRSessionApi = {
      requestSession: vi.fn().mockRejectedValue(new Error('permission denied')),
    };
    const controller = new ImmersiveArSessionController(
      xr,
      vi.fn(),
      (state) => states.push(state),
    );

    await controller.start();

    expect(states.map((state) => state.kind)).toEqual([
      'session-starting',
      'session-denied-or-failed',
    ]);
    expect(states.at(-1)?.detail).toBe('permission denied');
  });

  it('requires local-floor and returns to a non-active state after session end', async () => {
    const session = new FakeSession();
    const states: XRState[] = [];
    const requestSession = vi.fn().mockResolvedValue(session);
    const bindSession = vi.fn().mockResolvedValue(undefined);
    const controller = new ImmersiveArSessionController(
      { requestSession },
      bindSession,
      (state) => states.push(state),
    );

    await controller.start();
    session.end();

    expect(requestSession).toHaveBeenCalledWith('immersive-ar', {
      requiredFeatures: ['local-floor'],
    });
    expect(bindSession).toHaveBeenCalledWith(session);
    expect(states.map((state) => state.kind)).toEqual([
      'session-starting',
      'session-active',
      'session-ended',
    ]);
  });
});
