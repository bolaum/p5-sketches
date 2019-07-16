/** @typedef {import('p5')} P5lib */

class FPS {
  constructor(p5, x, y, textSize = 20) {
    this._p5 = p5;
    this._x = x;
    this._y = y;
    this._textSize = textSize;
    this._curFps = 0;
    this._sinceLastUpdate = 0.0;
  }

  show(elapsed) {
    /** @type {P5lib} */
    const p5 = this._p5;

    this._sinceLastUpdate += elapsed;
    if (this._sinceLastUpdate > 1.0) {
      this._curFps = p5.frameRate();
      this._sinceLastUpdate = elapsed;
    }

    const counterStr = `${p5.round(this._curFps)}`;

    p5.push();
    p5.textSize(this._textSize);
    p5.fill(255);
    p5.noStroke();
    p5.rect(this._x, this._y - this._textSize, p5.textWidth(counterStr), this._textSize);
    p5.fill(0);
    p5.text(counterStr, this._x, this._y);
    p5.pop();
  }
}

export { FPS as default };
