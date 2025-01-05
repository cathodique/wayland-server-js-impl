"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlRegistry = exports.SpecificRegistry = void 0;
const node_stream_1 = require("node:stream");
const wayland_interpreter_js_1 = require("../wayland_interpreter.js");
const base_object_js_1 = require("./base_object.js");
const event_clientserver_js_1 = require("../lib/event_clientserver.js");
class SpecificRegistry extends node_stream_1.EventEmitter {
    map = new Map();
    get iface() { throw new Error("SpecificRegistry (base class for specific registries) does not have an iface name"); }
    ;
    vs;
    transport;
    constructor(vs) { super(); this.vs = new Set(vs); this.transport = new event_clientserver_js_1.EventServer(); }
    add(v) { this.vs.add(v); this.emit('new', v); }
    delete(v) { this.vs.delete(v); this.emit('del', v); }
    addTo(r, v) {
        this.map.set(r.registry.length, v);
        r.registry.push(this.iface);
    }
    unmount = new Map();
    applyTo(reg) {
        for (const v of this.vs)
            this.addTo(reg, v);
        const newEvList = (function (v) {
            this.addTo(reg, v);
        }).bind(this);
        this.on('new', newEvList);
        const delEvList = (function (v) {
            this.addTo(reg, v);
        }).bind(this);
        this.on('del', delEvList);
        this.unmount.set(reg, new Map([['new', newEvList], ['del', delEvList]]));
    }
    unapplyTo(reg) {
        this.unmount.get(reg).forEach((v, k) => this.off(k, v));
    }
}
exports.SpecificRegistry = SpecificRegistry;
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
