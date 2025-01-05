"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlDataDevice = void 0;
const base_object_js_1 = require("./base_object.js");
const name = 'wl_data_device';
class WlDataDevice extends base_object_js_1.BaseObject {
    seat;
    constructor(conx, oid, parent, args) {
        super(conx, oid, parent, args);
        this.seat = args.seat;
    }
    get iface() { return name; }
}
exports.WlDataDevice = WlDataDevice;
