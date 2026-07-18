import * as THREE from 'three';
import type {
  EarthAxisPresentationModel,
  PresentationPoint,
} from '../presentation/earthAxisPresentationModel';
import type { ApplicationBasisDirection } from '../presentation/mapEnuToApplicationBasis';

const RADIANS_TO_ARCSECONDS = (180 / Math.PI) * 3600;
const UNIT_DIRECTION_TOLERANCE = 1e-9;

export const CAMERA_RELATIVE_CORE_COMPONENT_BUDGET_METERS = 7_000_000;

export interface CameraRelativeVector {
  readonly frame: 'CAMERA_VIEW';
  readonly units: 'meters' | 'unitless';
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface EarthAxisCameraRelativeFrame {
  readonly kind: 'CAMERA_RELATIVE_HOMOGENEOUS_EARTH_AXIS';
  readonly renderStrategy: 'CAMERA_RELATIVE_CORE_AND_HOMOGENEOUS_PROJECTIVE_POLES';
  readonly coreView: CameraRelativeVector;
  readonly northDirectionView: CameraRelativeVector;
  readonly southDirectionView: CameraRelativeVector;
  readonly cameraRelativeCoreMagnitudeMeters: number;
  readonly maximumUploadedComponentMagnitude: number;
  readonly float32CoreQuantizationErrorMeters: number;
  readonly float32DirectionAngularErrorArcseconds: number;
}

function finiteVector(
  value: THREE.Vector3,
  units: CameraRelativeVector['units'],
): CameraRelativeVector {
  if (![value.x, value.y, value.z].every(Number.isFinite)) {
    throw new Error('Camera-relative Earth-axis rendering requires finite vectors.');
  }
  return Object.freeze({
    frame: 'CAMERA_VIEW',
    units,
    x: value.x,
    y: value.y,
    z: value.z,
  });
}

function asVector3(value: PresentationPoint | ApplicationBasisDirection): THREE.Vector3 {
  return new THREE.Vector3(value.x, value.y, value.z);
}

function exactAntipode(value: CameraRelativeVector): CameraRelativeVector {
  return Object.freeze({
    frame: 'CAMERA_VIEW',
    units: 'unitless',
    x: -value.x,
    y: -value.y,
    z: -value.z,
  });
}

function float32Vector(value: CameraRelativeVector): THREE.Vector3 {
  return new THREE.Vector3(
    Math.fround(value.x),
    Math.fround(value.y),
    Math.fround(value.z),
  );
}

function angularSeparationArcseconds(
  first: CameraRelativeVector,
  second: THREE.Vector3,
): number {
  const a = new THREE.Vector3(first.x, first.y, first.z).normalize();
  const b = second.normalize();
  const cross = new THREE.Vector3().crossVectors(a, b).length();
  const dot = THREE.MathUtils.clamp(a.dot(b), -1, 1);
  return Math.atan2(cross, dot) * RADIANS_TO_ARCSECONDS;
}

/**
 * Produces the only values uploaded to the geocentric renderer.
 *
 * JavaScript keeps the scientific coordinates in double precision. The
 * active calibrated parent is applied once in world space, the current eye
 * position is subtracted before float32 upload, and the eye rotation places
 * the result in view coordinates. Projective poles remain unit directions;
 * no finite celestial distance enters a GPU attribute or object transform.
 */
export function createEarthAxisCameraRelativeFrame(
  model: EarthAxisPresentationModel,
  calibratedWorldMatrix: THREE.Matrix4,
  cameraWorldMatrix: THREE.Matrix4,
): EarthAxisCameraRelativeFrame {
  if (
    model.renderStrategy !==
      'CAMERA_RELATIVE_CORE_AND_HOMOGENEOUS_PROJECTIVE_POLES' ||
    model.depthContract !== 'LINEAR_XR_DEPTH_WITH_NON_WRITING_CELESTIAL_OVERLAY'
  ) {
    throw new Error('Earth-axis render model does not declare the hardened projective contract.');
  }

  const cameraPositionWorld = new THREE.Vector3().setFromMatrixPosition(cameraWorldMatrix);
  const cameraWorldRotation = new THREE.Quaternion().setFromRotationMatrix(cameraWorldMatrix);
  const worldToCameraRotation = cameraWorldRotation.clone().invert();

  const coreWorld = asVector3(model.earthCore).applyMatrix4(calibratedWorldMatrix);
  const coreViewValue = coreWorld
    .sub(cameraPositionWorld)
    .applyQuaternion(worldToCameraRotation);

  const northApplication = asVector3(model.north.directionApplication);
  const northApplicationLength = northApplication.length();
  if (
    !Number.isFinite(northApplicationLength)
    || Math.abs(northApplicationLength - 1) > UNIT_DIRECTION_TOLERANCE
  ) {
    throw new Error('Projective Earth-axis rendering requires a finite unit pole direction.');
  }
  const northWorld = northApplication.transformDirection(calibratedWorldMatrix);
  const northViewValue = northWorld
    .applyQuaternion(worldToCameraRotation)
    .normalize();

  const coreView = finiteVector(coreViewValue, 'meters');
  const northDirectionView = finiteVector(northViewValue, 'unitless');
  const southDirectionView = exactAntipode(northDirectionView);
  const floatCore = float32Vector(coreView);
  const floatNorth = float32Vector(northDirectionView);
  const cameraRelativeCoreMagnitudeMeters = coreViewValue.length();
  const maximumUploadedComponentMagnitude = Math.max(
    Math.abs(coreView.x),
    Math.abs(coreView.y),
    Math.abs(coreView.z),
    Math.abs(northDirectionView.x),
    Math.abs(northDirectionView.y),
    Math.abs(northDirectionView.z),
  );

  if (maximumUploadedComponentMagnitude > CAMERA_RELATIVE_CORE_COMPONENT_BUDGET_METERS) {
    throw new Error('Camera-relative Earth-core coordinates exceed the validated GPU budget.');
  }

  return Object.freeze({
    kind: 'CAMERA_RELATIVE_HOMOGENEOUS_EARTH_AXIS',
    renderStrategy: 'CAMERA_RELATIVE_CORE_AND_HOMOGENEOUS_PROJECTIVE_POLES',
    coreView,
    northDirectionView,
    southDirectionView,
    cameraRelativeCoreMagnitudeMeters,
    maximumUploadedComponentMagnitude,
    float32CoreQuantizationErrorMeters: floatCore.distanceTo(coreViewValue),
    float32DirectionAngularErrorArcseconds: angularSeparationArcseconds(
      northDirectionView,
      floatNorth,
    ),
  });
}
