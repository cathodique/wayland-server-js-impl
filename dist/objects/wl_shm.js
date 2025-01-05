"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlShm = void 0;
const wayland_interpreter_js_1 = require("../wayland_interpreter.js");
const base_object_js_1 = require("./base_object.js");
const name = 'wl_shm';
class WlShm extends base_object_js_1.BaseObject {
    static supportedFormats = [
        'argb8888',
        'xrgb8888',
    ];
    constructor(conx, oid, parent, args) {
        super(conx, oid, parent, args);
        for (const format of WlShm.supportedFormats)
            this.connection.addCommand(this, 'format', { format: wayland_interpreter_js_1.interfaces['wl_shm'].enums.format.atoi[format] });
    }
    wlCreatePool() { }
    get iface() { return name; }
}
exports.WlShm = WlShm;
