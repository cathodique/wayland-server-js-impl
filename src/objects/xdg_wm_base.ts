import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { WlSurface } from "./wl_surface.js";
import { XdgSurface } from "./xdg_surface.js";

const name = 'xdg_wm_base' as const;
export class XdgWmBase extends BaseObject {
  wlSurface: WlSurface;

  get iface() { return name }

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);

    this.wlSurface = args.surface;
  }
  wlGetXdgSurface(args: { id: XdgSurface, surface: WlSurface }) {
    args.surface.xdgSurface = args.id;
  }
}
