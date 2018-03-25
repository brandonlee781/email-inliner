"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as winston from 'winston';
// winston.level = 'debug';
const winston_1 = require("winston");
exports.logger = new winston_1.Logger({
    exitOnError: false,
    transports: [
        new winston_1.transports.Console(),
    ],
});
// export class Logger {
//   private name: string;
//   constructor(name: string) {
//     this.name = name;
//   }
//   debug(format: string, ...params: any[]) {
//     winston.log.apply(this, ['debug', this.name + ' - ' + format].concat(params));
//   }
//   info(format: string, ...params: any[]) {
//     winston.log.apply(this, ['info', this.name + ' - ' + format].concat(params));
//   }
//   warn(format: string, ...params: any[]) {
//     winston.log.apply(this, ['warn', this.name + ' - ' + format].concat(params));
//   }
//   error(format: string, ...params: any[]) {
//     winston.log.apply(this, ['error', this.name + ' - ' + format].concat(params));
//   }
// }
//# sourceMappingURL=Logger.js.map