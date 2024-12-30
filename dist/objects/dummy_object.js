"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlDummy = void 0;
const base_object_js_1 = require("./base_object.js");
const name = 'wl_dummy';
class WlDummy extends base_object_js_1.WlObject {
    get iface() { return name; }
}
exports.WlDummy = WlDummy;
