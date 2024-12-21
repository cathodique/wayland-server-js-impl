import { interfaces } from "../wayland_interpreter.js";
import { WlObject } from "./wl_object.js";
const name = 'wl_registry';
export class WlRegistry extends WlObject {
    get iface() { return name; }
    static registry = [
        null,
        'wl_compositor',
        null,
        'wl_shm',
        'wl_output',
        null,
        'wl_data_device_manager',
        null,
        'wl_subcompositor',
        'xdg_wm_base',
        null,
        null,
        null,
        null,
        'wl_seat',
    ];
    constructor(conx, oid, args) {
        super(conx, oid, args);
        for (const i in WlRegistry.registry) {
            if (!WlRegistry.registry[i])
                continue;
            const iface = interfaces[WlRegistry.registry[i]];
            conx.addCommand(this, 'global', { name: i, interface: iface.name, version: iface.version });
        }
    }
    bind() { }
    getRegistry() { }
}
