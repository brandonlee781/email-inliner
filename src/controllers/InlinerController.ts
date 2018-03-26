import axios, { AxiosPromise } from 'axios';
import cheerio from 'cheerio';
import juice from 'juice';
import { minify } from 'html-minifier';
import { logger } from '../util/Logger';

export class InlinerController {
  public async fromUrl(url: string): Promise<string> {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const styles = await this.getStyles($);

      $('script, noscript, link').remove();
      juice.inlineDocument($, styles);
      const minified = this.minifyHtml($);

      return minified;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  public async fromHtml(html: string): Promise<string> {
    try{
      const $ = cheerio.load(html);
      const styles = await this.getStyles($);

      $('script, noscript, link').remove();
      juice.inlineDocument($, styles);
      const minified = this.minifyHtml($);

      return minified;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  private async getStyles($: CheerioStatic): Promise<string> {
    try {
      const linkTags: Cheerio = $('head').find('link[rel=stylesheet]').not((i, el) => {
        const href = $(el).attr('href');
        return href.includes('fonts.googleapis.com');
      });
      const promises: AxiosPromise[] = [];
      linkTags.each((ind, ele) => {
        const href = $(ele).attr('href');
        promises.push(axios.get(href));
      });

      const stylesheets = await Promise.all(promises);
      return stylesheets.map(s => s.data).reduce((a, b) => a.concat(b), '');
    } catch (err) {
      throw err;
    }
  }

  private minifyHtml($: CheerioStatic): string {
    try {
      return minify($.html(), {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
      });
    } catch (err) {
      throw err;
    }
  }
}