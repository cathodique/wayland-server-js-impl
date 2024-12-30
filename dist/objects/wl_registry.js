"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlRegistry = void 0;
const wayland_interpreter_js_1 = require("../wayland_interpreter.js");
const base_object_js_1 = require("./base_object.js");
const name = 'wl_registry';
class WlRegistry extends base_object_js_1.WlObject {
    get iface() { return name; }
    static baseRegistry = [
        null,
        'wl_compositor',
        'wl_shm',
        'wl_subcompositor',
        'xdg_wm_base',
        // 'wl_seat',
        // 'wl_data_device_manager',
    ];
    static supportedByRegistry = [
        ...WlRegistry.baseRegistry,
        'wl_output',
    ];
    registry = [...WlRegistry.baseRegistry.map((v) => [v, null])];
    constructor(conx, oid, parent, args) {
        // if (conx.registry) return conx.registry;
        super(conx, oid, parent, args);
        for (const outputConfig of this.connection.compositor.outputConfigurations) {
            this.registry.push(['wl_output', { ...outputConfig, expectedIface: 'wl_output' }]);
        }
        for (const numericName in this.registry) {
            const [name] = this.registry[numericName];
            if (!name)
                continue;
            const iface = wayland_interpreter_js_1.interfaces[name];
            conx.addCommand(this, 'global', { name: numericName, interface: iface.name, version: iface.version });
        }
    }
    getExtraData(oid) {
        return this.registry[oid][1];
    }
    wlBind() { }
    wlGetRegistry() { }
}
exports.WlRegistry = WlRegistry;
