import { Connection } from "../connection.js";
import { interfaces } from "../wayland_interpreter.js";
import { WlObject } from "./wl_object.js";

const name = 'wl_shm';
export class WlShm extends WlObject {
  static supportedFormats = [
    interfaces['wl_shm'].enums.format.argb8888,
    interfaces['wl_shm'].enums.format.xrgb8888,
  ];

  constructor(conx: Connection, oid: number, args: Record<string, any>) {
    super(conx, oid, args);

    for (const format of WlShm.supportedFormats)
      this.connection.addCommand(this, 'format', { format });
  }

  get iface() { return name }
}
