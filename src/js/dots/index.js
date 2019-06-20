import P5lib from 'p5';
import 'p5/lib/addons/p5.dom';
import _ from 'lodash';

import Polygon from './polygon';

const SIZE = 800;

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
  const MIN_RADIUS = SIZE / N_POLYGONS + (N_POLYGONS === 13 ? 40 : 0);
  const MAX_RADIUS = SIZE / 2;
  const DOT_SIZE = 15;

  /** @type {[Polygon]} */
  let polygons;
  let lastTime = 0.0;
  let elapsed = 0.0;
  let rpmSlider;
  let dotSlider;

  p5.setup = () => {
    p5.angleMode(p5.DEGREES);
    const cnv = p5.createCanvas(SIZE, SIZE);
    cnv.position((p5.windowWidth - p5.width) / 2, (p5.windowHeight - p5.height) / 2);

    p5.textSize(15);
    // p5.frameRate(15);
    polygons = _.times(
      N_POLYGONS,
      i => new Polygon(
        p5, 0, 0, p5.map(i, 0, N_POLYGONS, MIN_RADIUS, MAX_RADIUS), i + 3, 0, DOT_SIZE, POLYGON_COLORS[i],
      ),
    );

    lastTime = parseFloat(p5.millis());

    rpmSlider = p5.createSlider(0, 24, 6, 0.1);
    rpmSlider.position(cnv.position().x, cnv.position().y + cnv.height - rpmSlider.height);

    dotSlider = p5.createSlider(0, 30, 15, 1);
    dotSlider.position(
      cnv.position().x + cnv.width - rpmSlider.width,
      cnv.position().y + cnv.height - rpmSlider.height,
    );
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
      const rpm = rpmSlider.value() + (N_POLYGONS - i - 1) * (rpmSlider.value() / 2);
      polygon.setDotSize(dotSlider.value());
      polygon.setDotRPM(rpm);
      polygon.showDot(elapsed);
    });

    // console.log(slider.y);

    p5.text(`RPM: ${rpmSlider.value()}`, 5, p5.height - rpmSlider.height - 5);
    p5.text(`Dot size: ${dotSlider.value()}`, p5.width - rpmSlider.width, p5.height - rpmSlider.height - 5);
  };
};

new P5lib(s);
