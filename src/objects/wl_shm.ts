import { Connection } from "../connection.js";
import { interfaces } from "../wayland_interpreter.js";
import { ExistentParent, BaseObject } from "./base_object.js";

const name = 'wl_shm' as const;
export class WlShm extends BaseObject {
  static supportedFormats = [
    'argb8888',
    'xrgb8888',
  ];

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);

    for (const format of WlShm.supportedFormats)
      this.connection.addCommand(this, 'format', { format: interfaces['wl_shm'].enums.format.atoi[format] });
  }

  wlCreatePool() { }
  get iface() { return name }
}
