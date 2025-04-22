"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlDisplay = void 0;
const base_object_js_1 = require("./base_object.js");
const name = 'wl_display';
class WlDisplay extends base_object_js_1.BaseObject {
    get iface() { return name; } // We <3 JS prototype chain
    _version = 1;
    wlSync(args) {
        args.callback.done(1);
        this.connection.sendPending();
    }
    wlGetRegistry(args) {
        this.connection.registry = args.registry;
    }
    wlDestroy() { }
}
exports.WlDisplay = WlDisplay;
