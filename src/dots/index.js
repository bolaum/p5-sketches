import P5lib from 'p5';
import 'p5/lib/addons/p5.dom';
import _ from 'lodash';

import Polygon from './polygon';
import FPS from '../common/fps';

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

const parentDiv = document.getElementById('sketch');

/** @param p5 {P5lib} */
const s = (p5) => {
  let nPolygons = 13;
  let canvasSize;
  let minRadius;
  let maxRadius;
  let dotSize;
  let baseRpm;

  /** @type {[Polygon]} */
  let polygons;
  /** @type {FPS} */
  let fps;

  // const container = parentDiv;
  let cnv;
  let rpmSlider;
  let dotSlider;
  let nPolygonsInput;

  let lastTime = 0.0;
  let elapsed = 0.0;

  function getCanvasSize() {
    return p5.min(p5.windowWidth, p5.windowHeight);
  }

  function onWindowResize() {
    canvasSize = getCanvasSize();

    console.log('WINDOW RESIZE', canvasSize);

    p5.resizeCanvas(canvasSize, canvasSize);
  }

  function createPolygons(n) {
    minRadius = canvasSize / n + (n === 13 ? p5.windowWidth / 20 : 0);
    maxRadius = canvasSize / 2;

    console.log(minRadius, n);

    polygons = _.times(
      n,
      i => new Polygon(
        p5,
        0,
        0,
        p5.map(i, 0, n, minRadius, maxRadius),
        i + 3,
        0,
        dotSize,
        POLYGON_COLORS[i % POLYGON_COLORS.length],
      ),
    );
  }

  p5.windowResized = onWindowResize;

  p5.setup = () => {
    p5.angleMode(p5.DEGREES);
    // p5.frameRate(15);

    canvasSize = getCanvasSize();
    cnv = p5.createCanvas(canvasSize, canvasSize);

    onWindowResize();

    rpmSlider = p5.createSlider(0, 24, 6, 0.1);
    rpmSlider.position(cnv.position().x, cnv.position().y + cnv.height - rpmSlider.height - 5);

    dotSlider = p5.createSlider(0, 30, 15, 1);
    dotSlider.position(
      cnv.position().x + cnv.width - rpmSlider.width - 5,
      cnv.position().y + cnv.height - rpmSlider.height - 5,
    );

    fps = new FPS(p5, p5.width - 30, 30);

    nPolygonsInput = p5.createInput(nPolygons);
    nPolygonsInput.position(cnv.position().x + 5, cnv.position().y);
    nPolygonsInput.input(_.debounce(() => {
      const val = parseInt(nPolygonsInput.value(), 10);
      const n = _.isNumber(val) && val > 2 ? val : 2;
      nPolygonsInput.value(n);

      if (nPolygons !== n) {
        nPolygons = n;
        createPolygons(n);
      }
    }, 600));

    createPolygons(nPolygons);

    lastTime = parseFloat(p5.millis());
  };

  p5.draw = () => {
    baseRpm = rpmSlider.value();
    dotSize = dotSlider.value();

    p5.background(255);
    const curTime = p5.millis();
    elapsed = parseFloat(curTime - lastTime) / 1000.0;
    lastTime = curTime;

    _.eachRight(polygons, (polygon) => {
      polygon.setPosition(p5.width * 0.5, p5.height * 0.5);
      polygon.show(elapsed);
    });

    _.eachRight(polygons, (polygon, i) => {
      const rpm = baseRpm + (nPolygons - i - 1) * (baseRpm / 2);
      polygon.setDotSize(dotSize);
      polygon.setDotRPM(rpm);
      polygon.showDot(elapsed);
    });

    // console.log(slider.y);

    p5.push();
    p5.textSize(15);
    p5.text(`RPM: ${rpmSlider.value()}`, 5, p5.height - rpmSlider.height - 10);
    p5.text(`Dot size: ${dotSlider.value()}`, p5.width - rpmSlider.width - 5, p5.height - rpmSlider.height - 10);
    p5.pop();

    fps.show(elapsed);
  };
};

new P5lib(s);
