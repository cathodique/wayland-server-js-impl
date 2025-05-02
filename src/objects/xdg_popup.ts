import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { XdgSurface } from "./xdg_surface.js";

const name = 'xdg_popup' as const;
export class XdgPopup extends BaseObject {
  appId?: string;

  get iface() { return name }

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    if (!(parent instanceof XdgSurface)) throw new Error('Parent must be xdg_surface');
    super(conx, oid, parent, args);

    parent.role = this;

    const config = conx.registry?.outputRegistry.current;
    if (!config) throw new Error('Could not fetch outputRegistry - Did you instantiate wl_output before wl_registry?');

    // TODO: Retrieve that automatically (from config or sth idk)
    this.addCommand('configure', { width: 200, height: 200, x: 0, y: 0 });
    parent.addCommand('configure', { serial: parent.newSerial() });
  }
  get renderReady() {
    // Check if the top-level has been set-up enough to be render-ready
    return true;
  }
}
