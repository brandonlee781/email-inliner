"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const InlinerController_1 = require("./controllers/InlinerController");
function urlInliner(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = event.queryStringParameters.url;
            const inliner = new InlinerController_1.InlinerController();
            const html = yield inliner.fromUrl(url);
            const response = createResponse(200, { html });
            callback(null, response);
        }
        catch (err) {
            callback(null, createResponse(400, { error: err.message, stack: JSON.stringify(err.stack) }));
        }
    });
}
exports.urlInliner = urlInliner;
function htmlInliner(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contentType = event.headers['Content-Type'];
            let html;
            if (contentType === 'application/json') {
                html = JSON.parse(event.body);
            }
            else if (contentType === 'application/x-www-form-urlencoded') {
                html = decodeURI(event.body.replace('html=', ''));
            }
            else {
                html = event.body;
            }
            const inliner = new InlinerController_1.InlinerController();
            const inlinedHtml = yield inliner.fromHtml(html);
            callback(null, createResponse(200, { html: inlinedHtml }));
        }
        catch (err) {
            callback(null, createResponse(400, { error: err.message, stack: JSON.stringify(err.stack) }));
        }
    });
}
exports.htmlInliner = htmlInliner;
function createResponse(status, body) {
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        statusCode: status,
        body,
    };
}
//# sourceMappingURL=handler.js.map