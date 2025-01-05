"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlDummy = void 0;
const base_object_js_1 = require("./base_object.js");
class WlDummy extends base_object_js_1.BaseObject {
    _iface = 'wl_dummy';
    get iface() { return this._iface; }
    set iface(v) { this._iface = v; }
}
exports.WlDummy = WlDummy;
