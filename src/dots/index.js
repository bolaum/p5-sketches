import _ from 'lodash';

import P5Wrapper from '../common/p5wrapper';
import Polygon from '../common/polygon';

const POLYGON_COLORS = [
  'red',
  '#cd8410',
  '#cdcb10',
  '#8dcd10',
  '#56cea8',
  '#47c4cc',
  '#479ccc',
  '#476acc',
  '#5d47cc',
  '#9847cc',
  '#b547cc',
  '#cc47a2',
  '#cc4760',
];

class Dots extends P5Wrapper {
  setup() {
    this.nPolygons = 13;
    this.dotSize = 15;
    this.baseRpm = 6;

    this.createInput('Polygons', this.nPolygons, (value) => {
      const val = parseInt(value, 10);

      const n = _.isNumber(val) && val > 2 ? val : 2;

      if (this.nPolygons !== n) {
        this.createPolygons(n);
      }

      this.nPolygons = n;
    });

    this.createSlider('RPM', 0, 24, this.baseRpm, 0.1, (value) => {
      this.baseRpm = value;
    });

    this.createSlider('Dot size', 0, 30, this.dotSize, 1, (value) => {
      this.dotSize = value;
    });

    this.createPolygons(this.nPolygons);
  }

  update(elapsed) {
    _.eachRight(this.polygons, (polygon, i) => {
      const rpm = this.baseRpm + ((this.nPolygons - i - 1) * (this.baseRpm / 2));

      polygon.dotSize(this.dotSize);
      polygon.dotRpm(rpm);

      polygon.update(elapsed);
    });
  }

  render() {
    _.eachRight(this.polygons, (polygon) => {
      polygon.show();
    });

    _.eachRight(this.polygons, (polygon) => {
      polygon.showDot();
    });
  }

  createPolygons(n) {
    const { p5 } = this;

    const minRadius = this.canvasSize / n + (n === 13 ? p5.windowWidth / 20 : 0);
    const maxRadius = this.canvasSize / 2;

    // console.log(minRadius, n);

    this.polygons = _.times(
      n,
      i => new Polygon(
        p5,
        p5.width * 0.5,
        p5.height * 0.5,
        p5.map(i, 0, n, minRadius, maxRadius),
        i + 3,
        0,
        2,
        POLYGON_COLORS[i % POLYGON_COLORS.length],
        null,
        0,
        64,
        0,
      ),
    );
  }
}

new Dots();
