import express from 'express';
import { RegistrableController } from './RegisterableController';
import axios, { AxiosPromise } from 'axios';
import cheerio from 'cheerio';
import juice from 'juice';
import { minify } from 'html-minifier';
import { logger } from '../util/Logger';

type Res = express.Response;
type Req = express.Request;
type Next = express.NextFunction;

export class InlinerController implements RegistrableController {
  public register(app: express.Application): void {
    app.route('/').get(this.getIndex.bind(this));
  }

  private async getIndex(req: Req, res: Res, next: Next) {
    try {
      const url = req.query.url;
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const styles = await this.getStyles($);

      $('script, noscript, link').remove();
      juice.inlineDocument($, styles);

      res.send(minify($.html(), {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
      }));
    } catch (err) {
      logger.error(err);
      res.json(err.message);
    }
  }

  private async getStyles($: CheerioStatic) {
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
    return stylesheets.map(s => s.data).reduce((a, b) => a.concat(b));
  }
}