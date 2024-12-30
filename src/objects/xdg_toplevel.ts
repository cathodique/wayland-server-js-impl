import { Connection } from "../connection.js";
import { ExistentParent, WlObject } from "./base_object.js";
import { XdgSurface } from "./xdg_surface.js";

const name = 'xdg_toplevel';
export class XdgToplevel extends WlObject<ExistentParent> {
  appId?: string;

  assocParent: XdgToplevel | null = null;

  get iface() { return name }

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    if (!(parent instanceof XdgSurface)) throw new Error('Parent must be xdg_surface');
    super(conx, oid, parent, args);

    parent.role = this;
  }

  wlSetAppId(args: { appId: string }) {
    this.appId = args.appId;
  }

  wlSetParent(args: { parent: XdgToplevel }) {
    // TODO: Check if is mapped
    this.assocParent = args.parent;
  }

  get renderReady() {
    // Check if the top-level has been set-up enough to be render-ready
    return true;
  }
}
