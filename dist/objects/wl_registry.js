"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlRegistry = void 0;
const wayland_interpreter_js_1 = require("../wayland_interpreter.js");
const base_object_js_1 = require("./base_object.js");
const name = 'wl_registry';
class WlRegistry extends base_object_js_1.BaseObject {
    get iface() { return name; }
    static baseRegistry = [
        null,
        'wl_compositor',
        'wl_shm',
        'wl_subcompositor',
        'xdg_wm_base',
        'wl_data_device_manager',
    ];
    static supportedByRegistry = [
        ...WlRegistry.baseRegistry,
        'wl_seat',
        'wl_output',
    ];
    registry = [...WlRegistry.baseRegistry];
    outputRegistry;
    seatRegistry;
    constructor(conx, oid, parent, args, argsFromAbove) {
        // if (conx.registry) return conx.registry;
        super(conx, oid, parent, args);
        const regMeta = argsFromAbove.wl_registry;
        regMeta.outputs.applyTo(this);
        this.outputRegistry = regMeta.outputs;
        regMeta.seats.applyTo(this);
        this.seatRegistry = regMeta.seats;
        for (const numericName in this.registry) {
            const name = this.registry[numericName];
            if (!name)
                continue;
            const iface = wayland_interpreter_js_1.interfaces[name];
            conx.addCommand(this, 'global', { name: numericName, interface: iface.name, version: iface.version });
        }
    }
    wlBind() { }
    wlGetRegistry() { }
}
exports.WlRegistry = WlRegistry;
