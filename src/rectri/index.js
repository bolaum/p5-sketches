// import _ from 'lodash';

import P5Wrapper from '../common/p5wrapper';
import Polygon from '../common/polygon';

class RecTri extends P5Wrapper {
  setup() {
    const { p5 } = this;

    this.tri = new Polygon(p5, p5.width * 0.5, p5.height * 0.5, this.canvasSize / 2, 3);
    this.tri.strokeWeight(0.5);
  }

  // update(elapsed) {
  // }

  render() {
    const { p5 } = this;

    const iRadius = this.tri.radius();
    const iRot = this.tri.rotation();
    const [x, y] = this.tri.position();

    p5.translate(0, p5.height * 0.1);

    this.tri.show();

    this.renderSub(x, y, iRadius);

    this.tri.radius(iRadius);
    this.tri.rotation(iRot);
    this.tri.position(x, y);
  }

  renderSub(x, y, radius) {
    const { p5 } = this;

    if (radius < 3) {
      return;
    }

    const nr = radius / 2.0;

    // p5.push();
    // p5.noFill();
    // p5.circle(x, y, nr * 2);
    // p5.fill(0);
    // p5.circle(x, y, 5);
    // // p5.stroke(0);
    // // p5.strokeWeight(3);
    // // p5.line(x, y, x, y + 394);
    // p5.pop();

    this.tri.position(x, y);
    this.tri.rotation(180);
    this.tri.radius(nr);
    this.tri.show();
    this.tri.rotation(0);

    const xn = x + 0;
    const yp = nr; // const yp = p5.sqrt(p5.pow(nr, 2) - p5.pow(xn - x, 2));
    this.renderSub(xn, -yp + y, nr);

    const yn = y + nr / 2.0;
    const xp = p5.sqrt(p5.pow(nr, 2) - p5.pow(yn - y, 2));
    this.renderSub(-xp + x, yn, nr);
    this.renderSub(xp + x, yn, nr);

    // p5.push();
    // p5.strokeWeight(3);
    // p5.circle(x, -yn + y, 10);
    // // p5.circle(xn + x, yn, 10);
    // p5.pop();

    p5.noLoop();
  }
}

new RecTri();
