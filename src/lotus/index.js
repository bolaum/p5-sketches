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

class Lotus extends P5Wrapper {
  setup() {
    this.nPolygons = 20; // 35
    this.baseRpm = 12; // 21.6
    this.enableColors = false;

    this.dotSize = 8; // 7
    this.dotRpmDiv = 1.5; // 4
    this.showDotTrails = true;
    this.dotsOnTop = false;

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

    this.createToggle('Colors', this.enableColors, (value) => {
      this.enableColors = value;
    });

    this.createSlider('Dot size', 0, 30, this.dotSize, 1, (value) => {
      this.dotSize = value;
    });

    this.createSlider('Dot RPM divider', 1, 15, this.dotRpmDiv, 0.1, (value) => {
      this.dotRpmDiv = value;
    });

    this.createToggle('Trails', this.showDotTrails, (value) => {
      this.showDotTrails = value;
    });

    this.createToggle('Dots on top', this.dotsOnTop, (value) => {
      this.dotsOnTop = value;
    });

    this.createPolygons(this.nPolygons);
  }

  update(elapsed) {
    const { p5 } = this;

    _.eachRight(this.polygons, (polygon, i) => {
      const polyRpm = p5.map(i, 0, this.polygons.length - 1, -this.baseRpm, this.baseRpm);
      polygon.rpm(polyRpm);
      polygon.strokeColor(this.enableColors ? POLYGON_COLORS[i % POLYGON_COLORS.length] : 127);
      // polygon.fillColor(this.enableColors ? POLYGON_COLORS[i % POLYGON_COLORS.length] : 127);

      const dotRpm = this.baseRpm + (this.nPolygons - i - 1) * (this.baseRpm / 2);
      polygon.dotRpm(this.dotRpmDiv > 0 ? dotRpm / this.dotRpmDiv : 0);
      polygon.dotSize(this.dotSize);
      polygon.dotTrails(this.showDotTrails);

      polygon.update(elapsed);
    });
  }

  render() {
    _.eachRight(this.polygons, (polygon) => {
      polygon.show();

      if (!this.dotsOnTop) {
        polygon.showDot();
      }
    });

    if (this.dotsOnTop) {
      _.eachRight(this.polygons, (polygon) => {
        polygon.showDot();
      });
    }
  }

  createPolygons(n) {
    const { p5 } = this;

    const minRadius = p5.min(this.canvasSize / n, 10);
    const maxRadius = this.canvasSize / 2;

    // console.log(minRadius, n);

    this.polygons = _.times(
      n,
      i => new Polygon(
        p5,
        p5.width * 0.5,
        p5.height * 0.5,
        p5.map(i, 0, n, minRadius, maxRadius),
        6,
        0,
        0.6,
        0,
        'white',
        0,
        80,
        0,
      ),
    );
  }
}

new Lotus();
