import _ from 'lodash';

import P5Wrapper from '../common/p5wrapper';

class RecTri extends P5Wrapper {
  setup() {
    const { p5 } = this;

    this.setBackgroundClear(true);

    this.margin = 30;
    this.initialPoints = [];
    this.currentPoints = [];
    this.maxIterations = 1000;

    this.initialPoints = [
      p5.createVector(this.canvasSize * 0.5, this.margin),
      p5.createVector(0 + this.margin, this.canvasSize - this.margin),
      p5.createVector(this.canvasSize - this.margin, this.canvasSize - this.margin),
    ];

    this.rPoint = p5.createVector(p5.random(this.canvasSize), p5.random(this.canvasSize));
  }

  update(elapsed) {
    const { p5, p5lib } = this;

    _.times(150, (i) => {
      let { rPoint } = this;

      const rIPoint = p5.random(this.initialPoints);
      rPoint = p5lib.Vector.lerp(rPoint, rIPoint, 0.5);
      this.currentPoints[i] = rPoint;
      this.rPoint = rPoint;
      // console.log(rPoint.x, rPoint.y);
    });
  }

  render() {
    const { p5 } = this;

    p5.strokeWeight(2);

    _.each(this.initialPoints, (point) => {
      p5.point(point.x, point.y);
    });

    _.each(this.currentPoints, (point) => {
      p5.point(point.x, point.y);
    });
  }
}

new RecTri();
