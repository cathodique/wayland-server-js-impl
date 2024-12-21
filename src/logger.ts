import { Console } from "console";
import { Writable } from "stream";

let console: Logger = null as unknown as Logger;

const isEnabled = process.env.LOGGERS?.includes('wl_serv_i8a56qb0lm3ox1ng1cqai0e1') || false;

class Logger extends Console {
  constructor() {
    if (isEnabled) super(process.stdout, process.stderr);
    else super(new Writable(), new Writable());

    if (console) return console;
  }
}

console = new Logger();
export { console };
