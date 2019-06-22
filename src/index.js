import _ from 'lodash';
import $ from 'jquery';
import showdown from 'showdown';

import './index.scss';
import config from '../config';

function main() {
  const { sketches } = config;
  const converter = new showdown.Converter();

  _.each(sketches, async (sketch) => {
    const { default: md } = await import(`./${sketch}/README.md`);

    const parsedMd = _.template(md)({
      sketch,
      size: Math.min($('#app').innerWidth(), 600),
    });

    const html = converter.makeHtml(parsedMd);

    $('#app').append(html);
  });
}

main();
