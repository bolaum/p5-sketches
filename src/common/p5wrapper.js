import _ from 'lodash';
import $ from 'jquery';
import P5lib from 'p5';
import 'p5/lib/addons/p5.dom';

import './base.scss';
import sliderTmpl from './slider.ejs';
import inputTmpl from './input.ejs';
import toggleTmpl from './toggle.ejs';

import FPS from './fps';

class P5Wrapper {
  constructor() {
    this._parent = document.getElementById('sketch');

    this._cnv = null;
    this._fps = null;
    this._lastTime = 0;
    this._lastId = 0;

    this._s = (p5) => {
      p5.preload = this._preload.bind(this);
      p5.setup = this._setup.bind(this);
      p5.draw = this._draw.bind(this);
      p5.windowResized = this._windowResized.bind(this);
    };

    this._p5 = new P5lib(this._s, this._parent);
  }

  get p5() {
    return this._p5;
  }

  get canvasSize() {
    return this._p5.min(this._parent.offsetWidth, this._parent.offsetHeight);
  }

  preload() {}

  setup() {}

  update(elapsed) {
    // throw new Error('not implemented');
  }

  render(elapsed) {
    // throw new Error('not implemented');
  }

  createSlider(label, min, max, value, step, cb) {
    const id = `slider${this._getId()}`;
    // const debouncedCb = _.debounce(cb, 200);

    const html = sliderTmpl({
      label,
      min,
      max,
      value,
      step,
      id,
    });

    $('#params-menu').append(html);

    $(`#${id}`).on('moved.zf.slider', (e, handle) => {
      const val = parseFloat(handle.attr('aria-valuenow'));
      cb(val);
      // debouncedCb(val);
    });
  }

  createInput(label, value, cb) {
    const id = `input${this._getId()}`;
    const debouncedCb = _.debounce(cb, 600, {
      leading: false,
      trailing: true,
    });

    const html = inputTmpl({
      label,
      id,
    });

    $('#params-menu').append(html);

    $(`#${id}`).val(value);

    $(`#${id}`).keyup(() => {
      const val = $(`#${id}`).val();
      debouncedCb(val);
    });
  }

  createToggle(label, value, cb) {
    const id = `input${this._getId()}`;

    const html = toggleTmpl({
      label,
      id,
    });

    $('#params-menu').append(html);

    $(`#${id}`).prop('checked', value);

    $(`#${id}`).change(() => {
      const val = $(`#${id}`).prop('checked');
      console.log(val);
      cb(val);
      // debouncedCb(val);
    });
  }

  // PRIVATE

  _preload() {
    this.preload();
  }

  _setup() {
    const { p5 } = this;

    p5.angleMode(p5.DEGREES);
    this._cnv = p5.createCanvas(this.canvasSize, this.canvasSize);

    this._fps = new FPS(p5, p5.width - 30, 30);

    this._lastTime = parseFloat(p5.millis());

    this.setup();

    $('#params-menu').foundation()
  }

  _draw() {
    const { p5 } = this;

    const curTime = p5.millis();
    const elapsed = parseFloat(curTime - this._lastTime) / 1000.0;
    this._lastTime = curTime;

    this.update(elapsed);

    p5.background(255);

    this.render(elapsed);

    this._fps.show(elapsed);
  }

  _windowResized() {
    this._p5.resizeCanvas(this.canvasSize, this.canvasSize);
  }

  _getId() {
    this._lastId += 1;
    return this._lastId;
  }
}

export { P5Wrapper as default };
