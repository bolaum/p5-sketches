import P5lib from 'p5';
import 'p5/lib/addons/p5.dom';
import _ from 'lodash';

import '../common/base.scss';
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

const parent = document.getElementById('sketch');

const DEFAULT_N_POLYGONS = 20;
const DEFAULT_RPM = 12;
const DOT_RPM_DIV = 1.5;
const DEFAULT_DOT_SIZE = 8;
const SHOW_DOTS_TRAILS = true;
const ENABLE_COLORS = false;
const DOTS_ON_TOP = false;

/** @param p5 {P5lib} */
const s = (p5) => {
  let nPolygons = DEFAULT_N_POLYGONS;
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
    return p5.min(parent.offsetWidth, parent.offsetHeight);
  }

  function onWindowResize() {
    canvasSize = getCanvasSize();

    // console.log('WINDOW RESIZE', canvasSize);

    p5.resizeCanvas(canvasSize, canvasSize);
  }

  function createPolygons(n) {
    // minRadius = canvasSize / n;
    minRadius = p5.min(canvasSize / n, 10);
    maxRadius = canvasSize / 2;

    // console.log(minRadius, n);

    polygons = _.times(
      n,
      i => new Polygon(
        p5,
        p5.width * 0.5,
        p5.height * 0.5,
        p5.map(i, 0, n, minRadius, maxRadius),
        6,
        0,
        // dotSize,
        0,
        ENABLE_COLORS ? POLYGON_COLORS[i % POLYGON_COLORS.length] : 'black',
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

    rpmSlider = p5.createSlider(0, 32, DEFAULT_RPM, 0.1);
    rpmSlider.position(cnv.position().x, cnv.position().y + cnv.height - rpmSlider.height - 5);

    dotSlider = p5.createSlider(0, 30, DEFAULT_DOT_SIZE, 1);
    dotSlider.position(
      cnv.position().x + cnv.width - rpmSlider.width - 5,
      cnv.position().y + cnv.height - rpmSlider.height - 5,
    );

    fps = new FPS(p5, p5.width - 30, 30);

    nPolygonsInput = p5.createInput(nPolygons);
    nPolygonsInput.position(cnv.position().x + 5, cnv.position().y + 35);
    nPolygonsInput.size(60, 20);
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
    let rpm;
    baseRpm = rpmSlider.value();
    dotSize = dotSlider.value();

    p5.background(255);
    const curTime = p5.millis();
    elapsed = parseFloat(curTime - lastTime) / 1000.0;
    lastTime = curTime;

    const renderDots = (polygon, i) => {
      rpm = baseRpm + (nPolygons - i - 1) * (baseRpm / 2);
      polygon.setDotRPM(rpm / DOT_RPM_DIV);
      polygon.toggleTrails(SHOW_DOTS_TRAILS);
      if (dotSize > 0) {
        polygon.setDotSize(dotSize);
        polygon.showDot(elapsed);
      }
    };

    _.eachRight(polygons, (polygon, i) => {
      rpm = p5.map(i, 0, polygons.length - 1, -baseRpm, baseRpm);
      polygon.setPolygonRPM(rpm);
      polygon.show(elapsed);

      if (!DOTS_ON_TOP) {
        renderDots(polygon, i);
      }
    });

    if (DOTS_ON_TOP) {
      _.eachRight(polygons, (polygon, i) => {
        renderDots(polygon, i);
      });
    }

    // console.log(slider.y);

    p5.push();
    p5.textSize(15);
    p5.text('Polygons', 5, 30);
    p5.text(`RPM: ${rpmSlider.value()}`, 5, p5.height - rpmSlider.height - 10);
    p5.text(`Dot size: ${dotSlider.value()}`, p5.width - rpmSlider.width - 5, p5.height - rpmSlider.height - 10);
    p5.pop();

    fps.show(elapsed);
  };
};

new P5lib(s, parent);
