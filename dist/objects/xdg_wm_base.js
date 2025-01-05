"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XdgWmBase = void 0;
const base_object_js_1 = require("./base_object.js");
const name = 'xdg_wm_base';
class XdgWmBase extends base_object_js_1.BaseObject {
    wlSurface;
    get iface() { return name; }
    constructor(conx, oid, parent, args) {
        super(conx, oid, parent, args);
        this.wlSurface = args.surface;
    }
    wlGetXdgSurface() { }
}
exports.XdgWmBase = XdgWmBase;
