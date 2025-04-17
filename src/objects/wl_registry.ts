import { Connection } from "../connection.js";
import { interfaces } from "../wayland_interpreter.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { OutputConfiguration, OutputRegistry } from "./wl_output.js";
import { ObjectMetadata } from "../compositor.js";
import { SeatRegistry } from "./wl_seat.js";

export interface WlRegistryMetadata {
  outputs: OutputRegistry;
  seats: SeatRegistry;
}

const name = 'wl_registry' as const;
export class WlRegistry extends BaseObject {
  get iface() { return name }

  static baseRegistry: (string | null)[] = [
    null,
    'wl_compositor',
    'wl_shm',
    'wl_subcompositor',
    'xdg_wm_base',
    'wl_data_device_manager',
  ]

  static supportedByRegistry = [
    ...WlRegistry.baseRegistry,
    'wl_seat',
    'wl_output',
  ]

  registry: (string | null)[] = [...WlRegistry.baseRegistry];
  outputRegistry: OutputRegistry;
  seatRegistry: SeatRegistry;

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>, argsFromAbove: ObjectMetadata) {
    // if (conx.registry) return conx.registry;
    super(conx, oid, parent, args);

    const regMeta = argsFromAbove.wl_registry;

    regMeta.outputs.applyTo(this);
    this.outputRegistry = regMeta.outputs;

    regMeta.seats.applyTo(this);
    this.seatRegistry = regMeta.seats;

    for (const numericName in this.registry) {
      const name = this.registry[numericName];
      if (!name) continue;
      const iface = interfaces[name];
      conx.addCommand(this, 'global', { name: numericName, interface: iface.name, version: iface.version });
    }
  }

  wlBind() { }
  wlGetRegistry() { }
}
