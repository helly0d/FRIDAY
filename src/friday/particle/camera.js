import {mat4, vec3} from "gl-matrix";


export class Camera {
  constructor(fov, near, far, aspect) {
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.aspoect = aspect;

    this.pos = [0.0, 0.0, 1.0];
    this.target = [0.0, 0.0, 0.0];
    this.up = [0.0, 1.0, 0.0];
    this.right = [1.0, 0.0, 0.0];

    this.viewMat = mat4.create();
    this.projMat = mat4.create();
    this.viewProjMat = mat4.create();
  }

  update() {
    mat4.lookAt(this.viewMat, this.pos, this.target, this.up);
    mat4.perspective(this.projMat, this.fov * 2.0, this.aspect, this.near, this.far);
    mat4.mul(this.viewProjMat, this.projMat, this.viewMat);
  }

  getRay(u, v) {
    let x = vec3.clone(this.right);
    let y = vec3.clone(this.up);
    let z = vec3.create();

    const fovTan = Math.tan(this.fov);

    vec3.scale(x, x, fovTan * this.aspect);
    vec3.scale(y, y, fovTan);

    vec3.sub(z, this.target, this.pos);
    vec3.normalize(z, z);

    vec3.scale(x, x, 2.0 * u - 1.0);
    vec3.scale(y, y, 2.0 * v - 1.0);

    z[0] += x[0] + y[0];
    z[1] += x[1] + y[1];
    z[2] += x[2] + y[2];

    vec3.normalize(z, z);
    return z;
  }

  getPointOnTargetPlane(u, v) {
    let ray = this.getRay(u, v);

    let targetVec = vec3.create();
    vec3.sub(targetVec, this.target, this.pos);
    let targetDist = vec3.length(targetVec);

    const angle = Math.acos(vec3.dot(ray, targetVec) / targetDist);
    const scale = targetDist / Math.cos(angle);

    vec3.scale(ray, ray, scale);
    vec3.add(ray, ray, this.pos);

    return ray;
  }
}


export class CameraControls {
  constructor(camera) {
    this.camera = camera;
    this.setDefaults();

  }

  setDefaults() {
    this.yawAngle = 0.0;
    this.pitchAngle = 0.0;
    this.radius = 1.0;

    Object.assign(this.camera, {
      pos: [0.0, 0.0, this.radius],
      target: [0.0, 0.0, 0.0],
      up: [0.0, 1.0, 0.0],
      right: [1.0, 0.0, 0.0]
    });
  }

  reset() {
    this.setDefaults();
  }

  update() {
    let calcPos = [Math.sin(this.yawAngle, 0.0, Math.cos(this.yawAngle))];
    this.camera.righ = [calcPos[2], 0.0, -calcPos[0]];

    let pitchRot = mat4.create();
    mat4.rotate(pitchRot, pitchRot, this.pitchAngle, this.camera.right);
    vec3.transformMat4(calcPos, calcPos, pitchRot);

    vec3.scale(calcPos, calcPos, this.radius);

    vec3.add(this.camera.pos, this.camera.target, calcPos);
    vec3.cross(this.camera.up, calcPos, this.camera.right);
    vec3.normalize(this.camera.up, this.camera.up);
  }

  rotate(x, y) {
    this.yawAngle += x;
    this.pitchAngle += y;
  }

  pan(x, y) {
    vec3.scaleAndAdd(this.camera.target, this.camera.target, this.camera.right, x);
    vec3.scaleAndAdd(this.camera.target, this.camera.target, this.camera.up, y);
  }

  zoom(value) {
    this.radius -= value;
  }
}
