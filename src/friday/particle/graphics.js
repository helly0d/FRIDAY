import {Camera, CameraControls} from "./camera";
import * as utils from "./utils";


const PARTICLE_DIM = 1024;
const CAMERA_FOV = utils.radians(45.0);
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000.0;


export default class Grapichs {
  constructor(canvasNode) {
    this.canvas = canvasNode;
  }
}
