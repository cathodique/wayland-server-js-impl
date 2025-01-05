import { EventEmitter } from "node:stream";
import { Connection } from "../connection.js";
import { interfaces } from "../wayland_interpreter.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { OutputConfiguration, OutputRegistry } from "./wl_output.js";
import { ObjectMetadata } from "../compositor.js";
import { SeatConfiguration, SeatRegistry } from "./wl_seat.js";
import { EventClient, EventServer } from "../lib/event_clientserver.js";

export class SpecificRegistry<T, U extends EventServer<Record<string, any[]>, Record<string, any[]>>> extends EventEmitter<{ 'new': [T], 'del': [T] }> {
  map: Map<number, T> = new Map();

  get iface(): string { throw new Error("SpecificRegistry (base class for specific registries) does not have an iface name") };

  vs: Set<T>;

  transport: U;

  constructor(vs: T[]) { super(); this.vs = new Set(vs); this.transport = new EventServer() as U; }
  add(v: T) { this.vs.add(v); this.emit('new', v); }
  delete(v: T) { this.vs.delete(v); this.emit('del', v); }

  addTo(r: WlRegistry, v: T) {
    this.map.set(r.registry.length, v);
    r.registry.push(this.iface);
  }

  unmount = new Map<WlRegistry, Map<'new' | 'del', (v: T) => void>>();
  applyTo(reg: WlRegistry) {
    for (const v of this.vs) this.addTo(reg, v);

    const newEvList = (function (this: SpecificRegistry<T, U>, v: T) {
      this.addTo(reg, v)
    }).bind(this);
    this.on('new', newEvList);

    const delEvList = (function (this: SpecificRegistry<T, U>, v: T) {
      this.addTo(reg, v)
    }).bind(this);
    this.on('del', delEvList);

    this.unmount.set(reg, new Map([['new', newEvList], ['del', delEvList]]));
  }
  unapplyTo(reg: WlRegistry) {
    this.unmount.get(reg)!.forEach((v, k) => this.off(k, v));
  }
}

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
