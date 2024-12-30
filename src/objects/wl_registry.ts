import { OutputConfiguration } from "../compositor.js";
import { Connection, HypotheticalObject } from "../connection.js";
import { interfaces } from "../wayland_interpreter.js";
import { ExistentParent, WlObject } from "./base_object.js";
import { WlOutput } from "./wl_output.js";

export interface ExtraOutputData extends OutputConfiguration {
  expectedIface: 'wl_output';
}
export type ExtraData = ExtraOutputData;

const name = 'wl_registry' as const;
export class WlRegistry extends WlObject<ExistentParent> {
  get iface() { return name }

  static baseRegistry: (string | null)[] = [
    null,
    'wl_compositor',
    'wl_shm',
    'wl_subcompositor',
    'xdg_wm_base',
    // 'wl_seat',
    // 'wl_data_device_manager',
  ]

  static supportedByRegistry = [
    ...WlRegistry.baseRegistry,
    'wl_output',
  ]

  registry: [string | null, ExtraData | null][] = [...WlRegistry.baseRegistry.map((v) => [v, null] as [string | null, null])];

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    // if (conx.registry) return conx.registry;
    super(conx, oid, parent, args);

    for (const outputConfig of this.connection.compositor.outputConfigurations) {
      this.registry.push(['wl_output', { ...outputConfig, expectedIface: 'wl_output' }]);
    }

    for (const numericName in this.registry) {
      const [name] = this.registry[numericName];
      if (!name) continue;
      const iface = interfaces[name];
      conx.addCommand(this, 'global', { name: numericName, interface: iface.name, version: iface.version });
    }
  }

  getExtraData(oid: number) {
    return this.registry[oid][1];
  }

  wlBind() { }
  wlGetRegistry() { }
}
