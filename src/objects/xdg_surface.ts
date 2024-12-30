import { Connection } from "../connection.js";
import { ExistentParent, WlObject } from "./base_object.js";
import { WlSurface } from "./wl_surface.js";
import { XdgToplevel } from "./xdg_toplevel.js";

const name = 'xdg_surface';
export class XdgSurface extends WlObject<ExistentParent> {
  surface: WlSurface;
  role: XdgToplevel | null = null;

  lastConfigureSerial = 0;
  wasLastConfigureAcked = true;

  get iface() { return name }

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);

    this.surface = args.surface;

    this.addCommand('configure', { serial: this.newSerial() });
  }

  newSerial() {
    this.lastConfigureSerial += 1;
    this.wasLastConfigureAcked = false;
    return this.lastConfigureSerial;
  }

  wlAckConfigure({ serial }: { serial: number }) {
    if (serial !== this.lastConfigureSerial) throw new Error('Serials do not match');
    if (this.wasLastConfigureAcked) throw new Error('Last configure was already acked');

    this.wasLastConfigureAcked = true;
  }

  wlGetToplevel() { /* Self-fulfilling in xdg_toplevel */ }
}
