"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const juice_1 = __importDefault(require("juice"));
const html_minifier_1 = require("html-minifier");
const Logger_1 = require("../util/Logger");
class InlinerController {
    register(app) {
        app.route('/')
            .get(this.getIndex.bind(this))
            .post(this.postIndex.bind(this));
    }
    getIndex(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(url);
                const $ = cheerio_1.default.load(data);
                const styles = yield this.getStyles($);
                $('script, noscript, link').remove();
                juice_1.default.inlineDocument($, styles);
                const minified = this.minifyHtml($);
                return { html: minified };
            }
            catch (err) {
                Logger_1.logger.error(err);
                return { error: err.message };
            }
        });
    }
    postIndex(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const html = req.body.html;
                const $ = cheerio_1.default.load(html);
                const styles = yield this.getStyles($);
                $('script, noscript, link').remove();
                juice_1.default.inlineDocument($, styles);
                const minified = this.minifyHtml($);
                res.send(minified);
            }
            catch (err) {
                Logger_1.logger.error(err);
                res.json(err.message);
            }
        });
    }
    getStyles($) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const linkTags = $('head').find('link[rel=stylesheet]').not((i, el) => {
                    const href = $(el).attr('href');
                    return href.includes('fonts.googleapis.com');
                });
                const promises = [];
                linkTags.each((ind, ele) => {
                    const href = $(ele).attr('href');
                    promises.push(axios_1.default.get(href));
                });
                const stylesheets = yield Promise.all(promises);
                return stylesheets.map(s => s.data).reduce((a, b) => a.concat(b));
            }
            catch (err) {
                throw err;
            }
        });
    }
    minifyHtml($) {
        return html_minifier_1.minify($.html(), {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
        });
    }
}
exports.InlinerController = InlinerController;
//# sourceMappingURL=InlinerController.js.map