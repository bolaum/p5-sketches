import _ from 'lodash';

/** @typedef {import('p5')} P5lib */

class Polygon {
  constructor(p5, x, y, radius, nPoints, dotRPM, dotSize = 9, color = 'black') {
    this._p5 = p5;
    this._nPoints = nPoints;
    this._color = color;

    this.setDotSize(dotSize);
    this.setDotRPM(dotRPM);
    this.setPosition(x, y);
    this.setRadius(radius);
  }

  setPosition(x, y) {
    this._x = x;
    this._y = y;
  }

  setRadius(radius) {
    /** @type {P5lib} */
    const p5 = this._p5;

    this._r = radius;
    this._vertices = [];

    const angle = 360.0 / this._nPoints;

    for (let a = 0; a < 360.0; a += angle) {
      const sx = p5.cos(a) * this._r;
      const sy = p5.sin(a) * this._r;
      this._vertices.push([sx, sy]);
    }

    this.setDotPosition(0, 0);

    this._dotVextexIndex = 0;
    this._curLerpInc = 0.5;
  }

  setDotPosition(x, y) {
    this._dotX = x;
    this._dotY = y;
  }

  setDotRPM(rpm) {
    this._dotRPM = rpm;
  }

  setDotSize(size) {
    this._dotSize = size;
  }

  show() {
    /** @type {P5lib} */
    const p5 = this._p5;

    p5.push();

    p5.translate(this._x, this._y);
    p5.rotate(90 - (180.0 / this._nPoints));
    p5.noFill();
    p5.strokeWeight(2);
    p5.stroke(this._color);
    p5.beginShape();
    _.each(this._vertices, vertex => p5.vertex(...vertex));
    p5.endShape(p5.CLOSE);

    p5.pop();
  }

  showDot(elapsed) {
    /** @type {P5lib} */
    const p5 = this._p5;

    p5.push();

    p5.translate(this._x, this._y);
    p5.rotate(90 - (180.0 / this._nPoints));

    this._curLerpInc += (((this._dotRPM / 60) * this._nPoints) * elapsed);

    if (this._curLerpInc > 1.0) {
      const n = Math.floor(this._curLerpInc);
      this._curLerpInc -= n;
      this._dotVextexIndex = (this._dotVextexIndex + n) % this._nPoints;
    }

    const srcVertex = this._vertices[this._dotVextexIndex];
    const dstVertex = this._vertices[(this._dotVextexIndex + 1) % this._nPoints];

    this.setDotPosition(
      p5.lerp(srcVertex[0], dstVertex[0], this._curLerpInc),
      p5.lerp(srcVertex[1], dstVertex[1], this._curLerpInc),
    );

    p5.stroke(0);
    p5.fill(0);
    p5.ellipse(this._dotX, this._dotY, this._dotSize);

    p5.pop();
  }
}

export { Polygon as default };
