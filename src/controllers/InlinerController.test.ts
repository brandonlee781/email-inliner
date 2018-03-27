import { InlinerController } from './InlinerController';
import axios from 'axios';
import juice from 'juice';
import { minify } from 'html-minifier';
import cheerio from 'cheerio';

describe('InlinerController', () => {
  let inliner: InlinerController;

  beforeEach(() => {
    inliner = new InlinerController();
  });

  test('it exists', () => {
    expect(inliner).toBeDefined();
  });

  describe('fromUrl method', () => {
    test('returns correct html', async () => {
      const google = 'https://www.google.com';
      const fromUrl = await inliner.fromUrl(google);

      const googleHTML = await axios.get(google);
      const $ = cheerio.load(googleHTML.data);
      $('script, noscript, link').remove();
      juice.inlineDocument($, '');
      const minified = minify($.html(), {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
      });

      const $mini = cheerio.load(minified);

      expect(typeof fromUrl).toEqual('string');
      expect(fromUrl).toEqual(minified);
      expect($mini('script, noscript, link').length).toEqual(0);
    });
  });
});