"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlDataDeviceManager = void 0;
const base_object_js_1 = require("./base_object.js");
const name = 'wl_data_device_manager';
class WlDataDeviceManager extends base_object_js_1.BaseObject {
    get iface() { return name; }
    wlGetDataDevice() { }
}
exports.WlDataDeviceManager = WlDataDeviceManager;
