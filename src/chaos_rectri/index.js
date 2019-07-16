import _ from 'lodash';

import P5Wrapper from '../common/p5wrapper';

class RecTri extends P5Wrapper {
  setup() {
    const { p5 } = this;

    this.setBackgroundClear(true);

    this.margin = 0;
    this.initialPoints = [];
    this.currentPoints = [];
    this.maxIterations = 1000;
    this.initialPoints = this.getTriangleInitialPoints();

    // console.log(this.initialPoints);

    this.rPoint = p5.createVector(p5.random(this.canvasSize), p5.random(this.canvasSize));
  }

  getTriangleInitialPoints() {
    const { p5, p5lib } = this;
    const mult = 0.5;
    const angle = 120;

    return [
      p5lib.Vector.fromAngle(p5.radians(90), this.canvasSize * mult),
      p5lib.Vector.fromAngle(p5.radians(90 + angle), this.canvasSize * mult),
      p5lib.Vector.fromAngle(p5.radians(90 - angle), this.canvasSize * mult),
    ];
  }

  getBoundingBox(points) {
    const { p5 } = this;

    const x = p5.min(_.map(points, 'x'));
    const y = p5.max(_.map(points, 'y'));
    const w = p5.max(_.map(points, 'x')) - x;
    const h = y - p5.min(_.map(points, 'y'));

    // console.log([x, y, w, h]);

    return {
      x, y, w, h,
    };
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

    const bBox = this.getBoundingBox(this.initialPoints);
    const center = p5.createVector(this.canvasSize * 0.5, this.canvasSize * 0.5 + bBox.y - bBox.h / 2);

    // p5.push();
    // p5.translate(this.canvasSize * 0.5, this.canvasSize * 0.5);
    // p5.strokeWeight(10);
    // p5.point(0, 0);
    // p5.pop();

    p5.push();

    p5.translate(center);
    p5.scale(1, -1);

    // p5.strokeWeight(5);
    // p5.stroke('red');
    // p5.point(0, 0);
    // p5.point(0, bBox.y - bBox.h / 2);

    // p5.noFill();
    // p5.stroke(p5.color(255, 0, 0, 128));
    // p5.rect(bBox.x, bBox.y, bBox.w, -bBox.h);
    // console.log(bBox);

    p5.strokeWeight(2);

    _.each(this.initialPoints, (point) => {
      p5.point(point.x, point.y);
      // p5.line(0, 0, point.x, point.y);
    });

    _.each(this.currentPoints, (point) => {
      p5.point(point.x, point.y);
    });

    p5.pop();
  }
}

new RecTri();
