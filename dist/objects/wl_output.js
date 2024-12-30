"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlOutput = void 0;
const wayland_interpreter_js_1 = require("../wayland_interpreter.js");
const base_object_js_1 = require("./base_object.js");
const name = 'wl_output';
class WlOutput extends base_object_js_1.WlObject {
    get iface() { return name; }
    outputConfig;
    constructor(conx, oid, parent, args) {
        super(conx, oid, parent, args);
        const extraData = this.connection.registry.getExtraData(args.name);
        if (extraData?.expectedIface !== this.iface)
            throw new Error();
        this.outputConfig = {
            x: extraData.x,
            y: extraData.y,
            w: extraData.w,
            h: extraData.h,
        };
        // TODO: FIX THIS MESS
        this.addCommand('geometry', {
            x: this.outputConfig.x,
            y: this.outputConfig.y,
            physical_width: this.outputConfig.w / 3.8,
            physical_height: this.outputConfig.h / 3.8,
            subpixel: wayland_interpreter_js_1.interfaces.wl_output.enums.subpixel.atoi.horizontal_rgb,
            make: 'IDK',
            model: 'IDK As if I knew',
            transform: wayland_interpreter_js_1.interfaces.wl_output.enums.transform.atoi.normal,
        });
        this.addCommand('mode', {
            mode: 3, // idc i just wann move on
            width: this.outputConfig.w,
            height: this.outputConfig.h,
            refresh: 60, // again idrc for now
        });
        this.addCommand('scale', { factor: 1 });
    }
}
exports.WlOutput = WlOutput;
