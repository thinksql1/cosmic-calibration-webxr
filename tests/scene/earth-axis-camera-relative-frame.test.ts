import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import type { EarthAxisPresentationModel } from '../../src/presentation/earthAxisPresentationModel';
import {
  CAMERA_RELATIVE_CORE_COMPONENT_BUDGET_METERS,
  createEarthAxisCameraRelativeFrame,
} from '../../src/scene/earthAxisCameraRelativeFrame';
import {
  WGS84_INVERSE_FLATTENING,
  WGS84_SEMI_MAJOR_AXIS_METERS,
} from '../../src/science/frames/observerGeocentricEarthAxis';

const DEGREES_TO_RADIANS = Math.PI / 180;

function geocentricFixture(
  latitudeDeg: number,
  elevationMeters = 0,
): EarthAxisPresentationModel {
  const latitude = latitudeDeg * DEGREES_TO_RADIANS;
  const flattening = 1 / WGS84_INVERSE_FLATTENING;
  const eccentricitySquared = flattening * (2 - flattening);
  const sinLatitude = Math.sin(latitude);
  const cosLatitude = Math.cos(latitude);
  const primeVerticalRadius = WGS84_SEMI_MAJOR_AXIS_METERS /
    Math.sqrt(1 - eccentricitySquared * sinLatitude * sinLatitude);
  const observerX = (primeVerticalRadius + elevationMeters) * cosLatitude;
  const observerZ =
    (primeVerticalRadius * (1 - eccentricitySquared) + elevationMeters) * sinLatitude;
  const coreNorth = sinLatitude * observerX - cosLatitude * observerZ;
  const coreUp = -cosLatitude * observerX - sinLatitude * observerZ;
  const core = Object.freeze({ x: 0, y: coreUp, z: -coreNorth });
  const northDirection = Object.freeze({
    frame: 'APPLICATION_BASIS' as const,
    units: 'unitless' as const,
    x: 0,
    y: sinLatitude,
    z: -cosLatitude,
  });
  const endpoint = (pole: 'NCP' | 'SCP', sign: 1 | -1) => Object.freeze({
    pole,
    pointKind: 'PROJECTIVE_DIRECTION_AT_INFINITY' as const,
    directionEnu: Object.freeze({ frame: 'HORIZONTAL_ENU' as const, units: 'unitless' as const, east: 0, north: sign * cosLatitude, up: sign * sinLatitude }),
    directionApplication: Object.freeze({ frame: 'APPLICATION_BASIS' as const, units: 'unitless' as const, x: 0, y: sign * northDirection.y, z: sign * northDirection.z }),
    diagnosticFiniteProxyPosition: Object.freeze({
      x: core.x,
      y: core.y + sign * northDirection.y * 1e13,
      z: core.z + sign * northDirection.z * 1e13,
    }),
    diagnosticProxyDistanceFromCoreMeters: 1e13,
    altitudeDeg: sign * latitudeDeg,
    azimuthDeg: sign === 1 ? 0 : 180,
    horizonRelation: latitudeDeg * sign > 0 ? 'above' as const : latitudeDeg * sign < 0 ? 'below' as const : 'on' as const,
    segmentVisible: true,
    segmentOpacity: 0.8,
    markerVisible: true,
    labelVisible: true,
  });
  return Object.freeze({
    kind: 'ready',
    model: 'IAU_P03_PRECESSION_ONLY',
    terminology: 'MEAN_POLE_OF_DATE',
    precisionTier: 'TIER_1',
    presentationKind: 'GEOCENTRIC_WORLD_SCALE_EARTH_CORE_AXIS',
    poleTopology: 'ANTIPODAL_PROJECTIVE_DIRECTIONS_AT_INFINITY',
    renderStrategy: 'CAMERA_RELATIVE_CORE_AND_HOMOGENEOUS_PROJECTIVE_POLES',
    depthContract: 'LINEAR_XR_DEPTH_WITH_NON_WRITING_CELESTIAL_OVERLAY',
    gpuCoordinatePolicy: 'NO_RAW_LARGE_WORLD_VERTEX_COORDINATES',
    observerSurfaceOrigin: Object.freeze({ x: 0, y: 0, z: 0 }),
    earthCore: core,
    earthCoreVisible: true,
    earthCoreMarkerDiameterPixels: 18,
    poleMarkerDiameterPixels: 18,
    poleLabelWidthPixels: 88,
    poleLabelHeightPixels: 42,
    poleRenderConvergenceUpperBoundArcseconds: 0.14,
    observerToCoreDistanceMeters: Math.hypot(core.x, core.y, core.z),
    observerToAxisDistanceMeters: Math.abs(observerX),
    north: endpoint('NCP', 1),
    south: endpoint('SCP', -1),
    snapshotIdentity: Object.freeze({ cacheKey: 'fixture', creationSequence: 1, observerRevision: 1, timeRevision: 1, calibrationRevision: 1, acceptedCalibrationRevision: 1 }),
  });
}

function cameraMatrix(
  position: THREE.Vector3,
  rotation = new THREE.Quaternion(),
): THREE.Matrix4 {
  return new THREE.Matrix4().compose(position, rotation, new THREE.Vector3(1, 1, 1));
}

describe('camera-relative homogeneous geocentric rendering frame', () => {
  it('subtracts the camera before upload and keeps translated pole directions projective', () => {
    const model = geocentricFixture(43);
    const origin = createEarthAxisCameraRelativeFrame(
      model,
      new THREE.Matrix4(),
      cameraMatrix(new THREE.Vector3()),
    );
    const translated = createEarthAxisCameraRelativeFrame(
      model,
      new THREE.Matrix4(),
      cameraMatrix(new THREE.Vector3(1.25, 0.5, -0.75)),
    );
    expect(translated.coreView.x).toBeCloseTo(origin.coreView.x - 1.25, 12);
    expect(translated.coreView.y).toBeCloseTo(origin.coreView.y - 0.5, 12);
    expect(translated.coreView.z).toBeCloseTo(origin.coreView.z + 0.75, 12);
    expect(translated.northDirectionView).toEqual(origin.northDirectionView);
    expect(translated.southDirectionView).toEqual(origin.southDirectionView);
  });

  it('uses the actual left and right eye transforms without copying a mono frame', () => {
    const model = geocentricFixture(43);
    const left = createEarthAxisCameraRelativeFrame(
      model,
      new THREE.Matrix4(),
      cameraMatrix(new THREE.Vector3(-0.032, 1.7, 0)),
    );
    const right = createEarthAxisCameraRelativeFrame(
      model,
      new THREE.Matrix4(),
      cameraMatrix(new THREE.Vector3(0.032, 1.7, 0)),
    );
    expect(left.coreView.x - right.coreView.x).toBeCloseTo(0.064, 12);
    expect(left.northDirectionView).toEqual(right.northDirectionView);
    expect(left.southDirectionView).toEqual(right.southDirectionView);
    const leftCoreRay = new THREE.Vector3(
      left.coreView.x,
      left.coreView.y,
      left.coreView.z,
    ).normalize();
    const rightCoreRay = new THREE.Vector3(
      right.coreView.x,
      right.coreView.y,
      right.coreView.z,
    ).normalize();
    expect(leftCoreRay.x).toBeGreaterThan(rightCoreRay.x);
  });

  it('keeps the world axis fixed while head rotation changes only its view coordinates', () => {
    const model = geocentricFixture(43);
    const yaw = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      Math.PI / 2,
    );
    const frame = createEarthAxisCameraRelativeFrame(
      model,
      new THREE.Matrix4(),
      cameraMatrix(new THREE.Vector3(), yaw),
    );
    const expectedDirection = new THREE.Vector3(
      model.north.directionApplication.x,
      model.north.directionApplication.y,
      model.north.directionApplication.z,
    ).applyQuaternion(yaw.clone().invert());
    expect(frame.northDirectionView.x).toBeCloseTo(expectedDirection.x, 12);
    expect(frame.northDirectionView.y).toBeCloseTo(expectedDirection.y, 12);
    expect(frame.northDirectionView.z).toBeCloseTo(expectedDirection.z, 12);
  });

  it('preserves the projective line across extreme head rotations', () => {
    const model = geocentricFixture(43);
    const rotations = [
      new THREE.Euler(0, Math.PI, 0),
      new THREE.Euler(Math.PI / 2, 0, 0),
      new THREE.Euler(0, 0, Math.PI),
      new THREE.Euler(-Math.PI / 2, Math.PI, Math.PI / 2),
    ];
    for (const rotation of rotations) {
      const frame = createEarthAxisCameraRelativeFrame(
        model,
        new THREE.Matrix4(),
        cameraMatrix(new THREE.Vector3(0.3, 1.8, -0.2), new THREE.Quaternion().setFromEuler(rotation)),
      );
      expect(frame.southDirectionView.x).toBe(-frame.northDirectionView.x);
      expect(frame.southDirectionView.y).toBe(-frame.northDirectionView.y);
      expect(frame.southDirectionView.z).toBe(-frame.northDirectionView.z);
      expect(Math.hypot(
        frame.northDirectionView.x,
        frame.northDirectionView.y,
        frame.northDirectionView.z,
      )).toBeCloseTo(1, 12);
    }
  });

  it('applies a calibrated world yaw once to both the core and one shared direction', () => {
    const model = geocentricFixture(43);
    const worldYaw = new THREE.Matrix4().makeRotationY(Math.PI / 2);
    const frame = createEarthAxisCameraRelativeFrame(
      model,
      worldYaw,
      cameraMatrix(new THREE.Vector3()),
    );
    const expectedCore = new THREE.Vector3(
      model.earthCore.x,
      model.earthCore.y,
      model.earthCore.z,
    ).applyMatrix4(worldYaw);
    const expectedDirection = new THREE.Vector3(
      model.north.directionApplication.x,
      model.north.directionApplication.y,
      model.north.directionApplication.z,
    ).transformDirection(worldYaw);
    expect(frame.coreView.x).toBeCloseTo(expectedCore.x, 12);
    expect(frame.coreView.z).toBeCloseTo(expectedCore.z, 12);
    expect(frame.northDirectionView.x).toBeCloseTo(expectedDirection.x, 12);
    expect(frame.northDirectionView.z).toBeCloseTo(expectedDirection.z, 12);
  });

  it('preserves exact antipodes and one core anchor across supported latitude/elevation cases', () => {
    for (const elevation of [-12_000, 0, 100_000]) {
      for (let latitude = -90; latitude <= 90; latitude += 5) {
        const frame = createEarthAxisCameraRelativeFrame(
          geocentricFixture(latitude, elevation),
          new THREE.Matrix4(),
          cameraMatrix(new THREE.Vector3(3, 2, -4)),
        );
        expect(frame.southDirectionView.x).toBe(-frame.northDirectionView.x);
        expect(frame.southDirectionView.y).toBe(-frame.northDirectionView.y);
        expect(frame.southDirectionView.z).toBe(-frame.northDirectionView.z);
        expect(frame.maximumUploadedComponentMagnitude).toBeLessThan(
          CAMERA_RELATIVE_CORE_COMPONENT_BUDGET_METERS,
        );
        expect(frame.float32CoreQuantizationErrorMeters).toBeLessThan(1);
        expect(frame.float32DirectionAngularErrorArcseconds).toBeLessThan(0.03);
      }
    }
  });

  it('rejects camera origins outside the bounded camera-relative rendering domain', () => {
    expect(() => createEarthAxisCameraRelativeFrame(
      geocentricFixture(0),
      new THREE.Matrix4(),
      cameraMatrix(new THREE.Vector3(20_000_000, 0, 0)),
    )).toThrow('GPU budget');
  });

  it('rejects non-unit and non-finite projective inputs before GPU upload', () => {
    const valid = geocentricFixture(43);
    const invalidDirection = Object.freeze({
      ...valid,
      north: Object.freeze({
        ...valid.north,
        directionApplication: Object.freeze({
          frame: 'APPLICATION_BASIS' as const,
          units: 'unitless' as const,
          x: 0,
          y: 0,
          z: 0,
        }),
      }),
    });
    expect(() => createEarthAxisCameraRelativeFrame(
      invalidDirection,
      new THREE.Matrix4(),
      cameraMatrix(new THREE.Vector3()),
    )).toThrow('finite unit pole direction');

    const invalidCore = Object.freeze({
      ...valid,
      earthCore: Object.freeze({ x: Number.NaN, y: valid.earthCore.y, z: valid.earthCore.z }),
    });
    expect(() => createEarthAxisCameraRelativeFrame(
      invalidCore,
      new THREE.Matrix4(),
      cameraMatrix(new THREE.Vector3()),
    )).toThrow('finite vectors');
  });
});
