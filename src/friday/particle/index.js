import raf from "raf";

import Clock from "./clock";
import Graphics from "./graphics";


export default class Particles {
  constructor(canvasNode) {
    this.canvas = canvasNode;
    this.graphics = new Graphics(this.canvas);
    this.clock = new Clock();

    this.update();
  }

  update() {
    raf(() => this.update());

    this.graphics.update(this.clock.getDelta());
  }
}
