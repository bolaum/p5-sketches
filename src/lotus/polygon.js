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
    this.setPolygonRPM(0);

    this._curPolygonLerpInc = 0;

    this._dotsTrailVertices = [];
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
    this._curDotLerpInc = 0.5;
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

  setPolygonRPM(rpm) {
    this._polygonRPM = rpm;
  }

  toggleTrails(enabled = null) {
    this._showTrails = _.isNil(enabled) ? !this._showTrails : enabled;
  }

  show(elapsed) {
    /** @type {P5lib} */
    const p5 = this._p5;

    p5.push();

    p5.translate(this._x, this._y);
    p5.rotate(90 - (180.0 / this._nPoints));

    // polygon rotation handling
    this._curPolygonLerpInc += (this._polygonRPM / 60) * elapsed;

    if (this._curPolygonLerpInc > 1.0) {
      this._curPolygonLerpInc -= p5.floor(this._curPolygonLerpInc);
    }

    p5.rotate(p5.lerp(0, 360, this._curPolygonLerpInc));

    p5.beginShape();
    p5.fill('white');
    p5.strokeWeight(0.6);
    p5.stroke(this._color);
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

    p5.rotate(p5.lerp(0, 360, this._curPolygonLerpInc));

    // dot handling
    this._curDotLerpInc += (((this._dotRPM / 60) * this._nPoints) * elapsed);

    if (this._curDotLerpInc > 1.0) {
      const n = p5.floor(this._curDotLerpInc);
      this._curDotLerpInc -= n;
      this._dotVextexIndex = (this._dotVextexIndex + n) % this._nPoints;
    }

    const srcVertex = this._vertices[this._dotVextexIndex];
    const dstVertex = this._vertices[(this._dotVextexIndex + 1) % this._nPoints];

    const sx = p5.lerp(srcVertex[0], dstVertex[0], this._curDotLerpInc);
    const sy = p5.lerp(srcVertex[1], dstVertex[1], this._curDotLerpInc);

    this.setDotPosition(sx, sy);

    // console.log(this._dotsTrailVertices);

    p5.noStroke();

    if (this._showTrails) {
      _.eachRight(this._dotsTrailVertices, ([x, y], i) => {
        p5.fill(p5.map(i, 0, this._dotsTrailVertices.length - 1, 127, 220, true));
        p5.ellipse(x, y, p5.map(i, 0, this._dotsTrailVertices.length - 1, this._dotSize, 1, true));
      });
    }

    this._dotsTrailVertices.unshift([this._dotX, this._dotY]);

    if (this._dotsTrailVertices.length > 16) {
      this._dotsTrailVertices.pop();
    }

    p5.fill(126);
    p5.ellipse(this._dotX, this._dotY, this._dotSize);

    p5.pop();
  }
}

export { Polygon as default };
