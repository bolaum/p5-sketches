/* global hljs */

import _ from 'lodash';
import $ from 'jquery';
import showdown from 'showdown';
import Navigo from 'navigo';

import './index.scss';
import config from '../config';

const SKETCH_MAX_WIDTH = 800;

function main() {
  const { sketches } = config;
  const converter = new showdown.Converter();
  const router = new Navigo(null, true);

  _.each(sketches, async ({ sketch, title }) => {
    const { default: md } = await import(`./${sketch}/README.md`);

    // console.log($('#app').innerWidth());

    const parsedMd = _.template(md)({
      sketch,
      size: Math.min($('#app').innerWidth(), SKETCH_MAX_WIDTH),
    });

    const html = converter.makeHtml(parsedMd);

    router.on(`/${sketch}`, () => {
      $('#app').html(html);
      // $('#app').append(html);
      // $('#app').append(html);
    }).resolve();

    $('#sketches-menu').append(`<li><a href="#/${sketch}" data-navigo>${title}</a></li>`);
  });

  // _.times(20, () => {
  //   $('#sketches-menu').append(`<li><a href="#/YOHO" data-navigo>YOHO YOHOYOHO</a></li>`);
  // });

  router.on(() => {
    router.navigate(`#/${sketches[0].sketch}`);
  }).resolve();


  router.hooks({
    after: () => {
      router.updatePageLinks();
      document.querySelectorAll('pre code').forEach((block) => {
        console.log('YO', block);
        hljs.highlightBlock(block);
      });
    },
  });
}

main();
