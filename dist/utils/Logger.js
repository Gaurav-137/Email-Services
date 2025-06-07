"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static log(msg) {
        console.log(`[LOG ${new Date().toISOString()}] ${msg}`);
    }
    static error(err) {
        console.error(`[ERROR ${new Date().toISOString()}] ${err}`);
    }
}
exports.Logger = Logger;
