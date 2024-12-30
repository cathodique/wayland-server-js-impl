"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlCompositor = void 0;
const base_object_js_1 = require("./base_object.js");
const name = 'wl_compositor';
class WlCompositor extends base_object_js_1.WlObject {
    get iface() { return name; }
    wlCreateSurface() { }
    wlCreateRegion() { }
}
exports.WlCompositor = WlCompositor;
