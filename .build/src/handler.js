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
function hello(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = event.queryStringParameters.url;
        const inliner = new InlinerController_1.InlinerController();
        const html = yield inliner.getIndex(url);
        let response;
        if (html.error) {
            callback(html.error, null);
        }
        response = {
            statusCode: 200,
            body: {
                html: html.html,
                input: event,
            },
        };
        callback(null, response);
    });
}
exports.hello = hello;
//# sourceMappingURL=handler.js.map