import P5lib from 'p5';
import 'p5/lib/addons/p5.dom';
import 'p5/lib/addons/p5.sound';

// import './dots/dots';

/** @param p5 {p5} */
const s = (p5) => {
  // const layers = [];

  let phase = 0;
  let zoff = 0;
  let slider;

  // sk.translate(window.innerWidth/2,window.innerHeight/2);
  p5.setup = () => {
    p5.createCanvas(600, 600);
    slider = p5.createSlider(0, 10, 3, 0.1);
  };

  p5.draw = () => {
    p5.background(0, 25);
    p5.translate(p5.width / 2, p5.height / 2);
    p5.stroke(255);
    p5.strokeWeight(2);
    p5.noFill();
    p5.beginShape();
    const noiseMax = slider.value();
    for (let a = 0; a < p5.TWO_PI; a += 0.05) {
      const xoff = p5.map(p5.cos(a + phase), -1, 1, 0, noiseMax);
      const yoff = p5.map(p5.sin(a + phase), -1, 1, 0, noiseMax);
      const r = p5.map(p5.noise(xoff, yoff, zoff), 0, 1, 100, p5.height / 2);
      const x = r * p5.cos(a);
      const y = r * p5.sin(a);
      p5.vertex(x, y);
    }
    p5.endShape(p5.CLOSE);
    phase += 0.01;
    zoff += 0.01;
  };
};

new P5lib(s);

// const s = (p5) => {
//   let sound;
//   let cvs;
//   let fft;
//   let mic;

//   // p5.preload = () => {
//   //   sound = p5.loadSound('assets/jessie.mp3');
//   // };

//   // fade sound if mouse is over canvas
//   function togglePlay() {
//     if (sound.isPlaying()) {
//       sound.pause();
//     } else {
//       sound.loop();
//     }
//   }

//   p5.setup = () => {
//     mic = new P5lib.AudioIn();
//     mic.start();

//     cvs = p5.createCanvas(600, 400);
//     // cvs.mouseClicked(togglePlay);
//     fft = new P5lib.FFT();
//     // sound.amp(0.5);
//     fft.setInput(mic);
//   };

//   p5.draw = () => {
//     p5.background(50);

//     const spectrum = fft.analyze();
//     p5.noStroke();
//     p5.fill(0, 255, 0); // spectrum is green
//     for (let i = 0; i < spectrum.length; i++) {
//       const x = p5.map(i, 0, spectrum.length, 0, p5.width);
//       const h = -p5.height + p5.map(spectrum[i], 0, 255, p5.height, 0);
//       p5.rect(x, p5.height, p5.width / spectrum.length, h);
//     }

//     // console.log(spectrum);

//     const waveform = fft.waveform();
//     p5.noFill();
//     p5.beginShape();
//     p5.stroke(255, 0, 0); // waveform is red
//     p5.strokeWeight(1);
//     for (let i = 0; i < waveform.length; i++) {
//       const x = p5.map(i, 0, waveform.length, 0, p5.width);
//       const y = p5.map(waveform[i], -1, 1, 0, p5.height);
//       p5.vertex(x, y);
//     }
//     p5.endShape();

//     p5.text('click to play/pause', 4, 10);
//   };
// };

// new P5lib(s);
