import { ExistentParent, WlObject } from "./base_object.js";
import { console } from "../logger.js";
import { Connection } from "../connection.js";
import { WlSurface } from "./wl_surface.js";

const name = 'wl_subsurface' as const;
export class WlSubsurface extends WlObject<ExistentParent> {
  get iface() { return name }

  assocSurface: WlSurface;
  assocParent: WlSurface;
  isSynced: boolean;

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);

    this.assocSurface = args.surface;
    this.assocSurface.subsurface = this;
    this.isSynced = true;
    this.assocParent = args.parent;
    args.parent.daughterSurfaces.push(args.surface);
  }

  wlSetDesync() { this.isSynced = false }
  wlSetSync() { this.isSynced = true }
}
