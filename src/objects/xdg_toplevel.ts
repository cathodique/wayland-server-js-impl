import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { XdgSurface } from "./xdg_surface.js";

const name = 'xdg_toplevel' as const;
export class XdgToplevel extends BaseObject {
  appId?: string;

  assocParent: XdgToplevel | null = null;

  get iface() { return name }

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    if (!(parent instanceof XdgSurface)) throw new Error('Parent must be xdg_surface');
    super(conx, oid, parent, args);

    parent.role = this;

    const config = conx.registry?.outputRegistry.current;
    if (!config) throw new Error('Could not fetch outputRegistry - Did you instantiate wl_output before wl_registry?');

    // TODO: Retrieve that automatically (from config or sth idk)
    this.addCommand('configureBounds', { width: config.effectiveW, height: config.effectiveH });
    this.addCommand('wmCapabilities', { capabilities: Buffer.alloc(0) });
    this.addCommand('configure', { width: 0, height: 0, states: Buffer.alloc(0) });
    parent.addCommand('configure', { serial: parent.newSerial() });
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
