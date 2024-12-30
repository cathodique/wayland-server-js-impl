"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.console = void 0;
const console_1 = require("console");
const stream_1 = require("stream");
let console = null;
exports.console = console;
const isEnabled = process.env.LOGGERS?.includes('wl_serv_i8a56qb0lm3ox1ng1cqai0e1') || false;
class Logger extends console_1.Console {
    constructor() {
        if (isEnabled)
            super(process.stdout, process.stderr);
        else
            super(new stream_1.Writable(), new stream_1.Writable());
        if (console)
            return console;
    }
}
exports.console = console = new Logger();
