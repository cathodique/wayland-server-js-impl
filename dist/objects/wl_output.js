"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlOutput = exports.OutputRegistry = void 0;
const wayland_interpreter_js_1 = require("../wayland_interpreter.js");
const base_object_js_1 = require("./base_object.js");
const wl_registry_js_1 = require("./wl_registry.js");
const name = 'wl_output';
class OutputRegistry extends wl_registry_js_1.SpecificRegistry {
    get iface() { return name; }
}
exports.OutputRegistry = OutputRegistry;
class WlOutput extends base_object_js_1.BaseObject {
    get iface() { return name; }
    info;
    recipient;
    constructor(conx, oid, parent, args) {
        super(conx, oid, parent, args);
        const outputReg = this.connection.registry.outputRegistry;
        this.info = outputReg.map.get(args.name);
        this.recipient = outputReg.transport.createRecipient();
        this.advertise();
        this.recipient.on('update', this.advertise.bind(this));
    }
    advertise() {
        // TODO: FIX THIS MESS
        this.addCommand('geometry', {
            x: this.info.x,
            y: this.info.y,
            physical_width: this.info.w / 3.8,
            physical_height: this.info.h / 3.8,
            subpixel: wayland_interpreter_js_1.interfaces.wl_output.enums.subpixel.atoi.horizontal_rgb,
            make: 'IDK',
            model: 'IDK As if I knew',
            transform: wayland_interpreter_js_1.interfaces.wl_output.enums.transform.atoi.normal,
        });
        this.addCommand('mode', {
            mode: 3, // idc i just wann move on
            width: this.info.w,
            height: this.info.h,
            refresh: 60, // again idrc for now
        });
        this.addCommand('scale', { factor: 1 });
    }
    release() { this.recipient.destroy(); }
}
exports.WlOutput = WlOutput;
