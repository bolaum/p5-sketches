import P5lib from 'p5';
import 'p5/lib/addons/p5.dom';
import _ from 'lodash';

import Polygon from './polygon';

const N_POLYGONS = 13;
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

/** @param p5 {P5lib} */
const s = (p5) => {
  const MIN_RADIUS = 90;
  const RADIUS_INC = 23;

  /** @type {[Polygon]} */
  let polygons;
  let lastTime = 0.0;
  let elapsed = 0.0;
  let slider;

  p5.setup = () => {
    p5.angleMode(p5.DEGREES);
    const cnv = p5.createCanvas(800, 800);
    cnv.position((p5.windowWidth - p5.width) / 2, (p5.windowHeight - p5.height) / 2);

    p5.textSize(15);
    // p5.frameRate(15);
    polygons = _.times(
      N_POLYGONS,
      i => new Polygon(p5, 0, 0, MIN_RADIUS + i * RADIUS_INC, i + 3, 0, 15, POLYGON_COLORS[i]),
    );

    lastTime = parseFloat(p5.millis());

    slider = p5.createSlider(0, 30, 6, 0.2);
    slider.position(cnv.position().x, cnv.position().y + cnv.height - slider.height);
  };

  p5.draw = () => {
    p5.background(255);
    const curTime = p5.millis();
    elapsed = parseFloat(curTime - lastTime) / 1000.0;
    lastTime = curTime;

    _.eachRight(polygons, (polygon) => {
      polygon.setPosition(p5.width * 0.5, p5.height * 0.5);
      polygon.show(elapsed);
    });

    _.eachRight(polygons, (polygon, i) => {
      const rpm = slider.value() + (N_POLYGONS - i - 1) * (slider.value() / 2);
      polygon.setDotRPM(rpm);
      polygon.showDot(elapsed);
    });

    // console.log(slider.y);

    p5.text(`RPM: ${slider.value()}`, 5, p5.height - slider.height - 5);
  };
};

new P5lib(s);
