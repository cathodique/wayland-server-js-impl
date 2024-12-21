import { Connection } from "../connection.js";
import { WlObject } from "./wl_object.js";
import { WlSurface } from "./wl_surface.js";

const name = 'xdg_surface';
export class XdgSurface extends WlObject {
  surface: WlSurface;

  get iface() { return name }

  constructor(conx: Connection, oid: number, args: Record<string, any>) {
    super(conx, oid, args);

    this.surface = args.suface;
  }
}
