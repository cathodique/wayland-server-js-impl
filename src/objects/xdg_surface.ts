import { Connection } from "../connection.js";
import { DoubleBuffer } from "../lib/doublebuffer.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { WlSurface } from "./wl_surface.js";
import { XdgPopup } from "./xdg_popup.js";
import { XdgToplevel } from "./xdg_toplevel.js";

interface WindowGeometry {
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
}

const name = 'xdg_surface' as const;
export class XdgSurface extends BaseObject {
  surface: WlSurface;
  role: XdgToplevel | XdgPopup | null = null;

  lastConfigureSerial = 0;
  wasLastConfigureAcked = true;

  get iface() { return name }

  geometry: DoubleBuffer<WindowGeometry> = new DoubleBuffer({ x: null, y: null, width: null, height: null });

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);

    this.surface = args.surface;

    this.surface.doubleBufferedState.add(this.geometry);
  }

  wlDestroy(): void {
    super.wlDestroy();
    this.surface.doubleBufferedState.delete(this.geometry);
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

  wlSetWindowGeometry(newGeom: { x: number, y: number, width: number, height: number }) {
    this.geometry.pending = newGeom;
  }

  wlGetToplevel() { /* Self-fulfilling in xdg_toplevel */ }
}
