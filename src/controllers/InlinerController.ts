import axios, { AxiosPromise } from 'axios';
import cheerio from 'cheerio';
import juice from 'juice';
import { minify } from 'html-minifier';

/**
 * Creates a new InlinerController instance
 * @class
 */
export class InlinerController {
  /**
   * Takes a single string URL to a website and returns the inlined and minified HTML
   * @async
   * @public
   * @param {string} url - The url to the website that will be inlined and minfied
   * @returns {string}
   */
  public async fromUrl(url: string): Promise<string> {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const styles = await this.getStyles($);

      $('script, noscript, link').remove();
      juice.juiceDocument($, { removeStyleTags: true });
      const minified = this.minifyHtml($);

      return minified;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Takes an HTML string, inlines all CSS, minfies it, and returns the result
   * @async
   * @public
   * @param {string} html - The non-inlined, non-minified HTML
   * @returns {string}
   */
  public async fromHtml(html: string): Promise<string> {
    try{
      const $ = cheerio.load(html);

      $('script, noscript, link').remove();
      juice.juiceDocument($, { removeStyleTags: true });
      $('head').append('<style>@import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic);</style>');
      const minified = this.minifyHtml($);

      return minified;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Takes a cheerio instance, finds all Stylesheet URLs, retrieves the CSS from those
   * links and returns the concatenated CSS string
   * @async
   * @private
   * @param {CheerioStatic} $ - Static Cheerio HTML instance
   * @returns {Promise<string>}
   */
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

  /**
   * Takes a cheerio instance and returns a minfied version of the HTML
   * @private
   * @param $ - Static Cheerio HTML instance
   * @returns {string}
   */
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