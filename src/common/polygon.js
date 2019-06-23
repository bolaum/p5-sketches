import _ from 'lodash';

/** @typedef {import('p5')} P5lib */

class Polygon {
  constructor(
    p5, x, y, radius, nPoints,
    rpm = 0.0, strokeWeight = 1, strokeColor = 0, fillColor = null,
    dotSize = 6.0, dotColor = 0, dotRpm = 0,
  ) {
    this._p5 = p5;
    this._nPoints = nPoints;

    this._curPolygonLerpInc = 0;
    this._curDotLerpInc = 0.0;
    this._dotsTrailVertices = [];

    this.position(x, y);
    this.radius(radius);
    this.rpm(rpm);
    this.strokeWeight(strokeWeight);
    this.strokeColor(strokeColor);
    this.fillColor(fillColor);

    this.dotSize(dotSize);
    this.dotPosition(0, 0);
    this.dotColor(dotColor);
    this.dotRpm(dotRpm);
    this.dotTrails(false);
  }

  position(x, y) {
    this._x = x;
    this._y = y;
  }

  radius(r) {
    /** @type {P5lib} */
    const p5 = this._p5;

    this._r = r;
    this._vertices = [];

    const angle = 360.0 / this._nPoints;

    for (let a = 0; a < 360.0; a += angle) {
      const sx = p5.cos(a) * this._r;
      const sy = p5.sin(a) * this._r;
      this._vertices.push([sx, sy]);
    }

    this.dotPosition(0, 0);

    this._dotVextexIndex = 0;
    this._curDotLerpInc = 0.5;
  }

  rpm(rpm) {
    this._rpm = rpm;
  }

  strokeWeight(weight) {
    this._strokeWeight = weight;
  }

  strokeColor(color) {
    this._strokeColor = color;
  }

  fillColor(color) {
    this._fillColor = color;
  }

  dotSize(size) {
    this._dotSize = size;
  }

  dotPosition(x, y) {
    this._dotX = x;
    this._dotY = y;
  }

  dotColor(color) {
    this._dotColor = color;
  }

  dotRpm(rpm) {
    this._dotRpm = rpm;
  }

  dotTrails(enabled) {
    this._showTrails = !!enabled;
  }

  update(elapsed) {
    /** @type {P5lib} */
    const p5 = this._p5;

    // polygon rotation handling
    this._curPolygonLerpInc += (this._rpm / 60) * elapsed;

    if (this._curPolygonLerpInc > 1.0) {
      this._curPolygonLerpInc -= p5.floor(this._curPolygonLerpInc);
    }

    // dot handling
    this._curDotLerpInc += (((this._dotRpm / 60) * this._nPoints) * elapsed);

    if (this._curDotLerpInc > 1.0) {
      const n = p5.floor(this._curDotLerpInc);
      this._curDotLerpInc -= n;
      this._dotVextexIndex = (this._dotVextexIndex + n) % this._nPoints;
    }

    const srcVertex = this._vertices[this._dotVextexIndex];
    const dstVertex = this._vertices[(this._dotVextexIndex + 1) % this._nPoints];

    const sx = p5.lerp(srcVertex[0], dstVertex[0], this._curDotLerpInc);
    const sy = p5.lerp(srcVertex[1], dstVertex[1], this._curDotLerpInc);

    this.dotPosition(sx, sy);

    this._dotsTrailVertices.unshift([this._dotX, this._dotY]);

    if (this._dotsTrailVertices.length > 16) {
      this._dotsTrailVertices.pop();
    }
  }

  show() {
    /** @type {P5lib} */
    const p5 = this._p5;

    p5.push();

    p5.translate(this._x, this._y);
    p5.rotate((90 - (180.0 / this._nPoints)) + p5.lerp(0, 360, this._curPolygonLerpInc));

    p5.beginShape();

    if (_.isNil(this._fillColor)) {
      p5.noFill();
    } else {
      p5.fill(this._fillColor);
    }

    if (_.isNil(this._strokeColor)) {
      p5.noStroke();
    } else {
      p5.stroke(this._strokeColor);
    }

    p5.strokeWeight(this._strokeWeight);
    _.each(this._vertices, vertex => p5.vertex(...vertex));
    p5.endShape(p5.CLOSE);

    p5.pop();
  }

  showDot() {
    /** @type {P5lib} */
    const p5 = this._p5;

    if (this._dotSize === 0) {
      return;
    }

    p5.push();

    p5.translate(this._x, this._y);
    p5.rotate(90 - (180.0 / this._nPoints) + p5.lerp(0, 360, this._curPolygonLerpInc));

    p5.noStroke();

    if (this._showTrails) {
      _.eachRight(this._dotsTrailVertices, ([x, y], i) => {
        p5.fill(p5.map(i, 0, this._dotsTrailVertices.length - 1, this._dotColor, 220, true));
        p5.ellipse(x, y, p5.map(i, 0, this._dotsTrailVertices.length - 1, this._dotSize, 1, true));
      });
    } else {
      p5.fill(this._dotColor);
      p5.ellipse(this._dotX, this._dotY, this._dotSize);
    }

    p5.pop();
  }
}

export { Polygon as default };
