"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlSubcompositor = void 0;
const base_object_js_1 = require("./base_object.js");
const name = 'wl_subcompositor';
class WlSubcompositor extends base_object_js_1.BaseObject {
    get iface() { return name; }
    wlGetSubsurface() { }
}
exports.WlSubcompositor = WlSubcompositor;
