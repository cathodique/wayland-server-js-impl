import { Connection } from "../connection.js";
import { WlObject } from "./wl_object.js";
import { WlSurface } from "./wl_surface.js";

const name = 'xdg_wm_base';
export class XdgWmBase extends WlObject {
  wlSurface: WlSurface;

  get iface() { return name }

  constructor(conx: Connection, oid: number, args: Record<string, any>) {
    super(conx, oid, args);

    this.wlSurface = args.surface;
  }

  getXdgSurface() { /* Self-fulfilling */ }
}
