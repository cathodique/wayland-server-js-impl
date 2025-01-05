import { Connection } from "../connection.js";
import { DoubleBuffer } from "../lib/doublebuffer.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { WlSurface } from "./wl_surface.js";
import { XdgToplevel } from "./xdg_toplevel.js";
interface WindowGeometry {
    x: number | null;
    y: number | null;
    width: number | null;
    height: number | null;
}
export declare class XdgSurface extends BaseObject {
    surface: WlSurface;
    role: XdgToplevel | null;
    lastConfigureSerial: number;
    wasLastConfigureAcked: boolean;
    get iface(): string;
    geometry: DoubleBuffer<WindowGeometry>;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    wlDestroy(): void;
    newSerial(): number;
    wlAckConfigure({ serial }: {
        serial: number;
    }): void;
    wlSetWindowGeometry(newGeom: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): void;
    wlGetToplevel(): void;
}
export {};
