import { Connection } from "../connection.js";
import { ExistentParent, WlObject } from "./base_object.js";
import { WlSurface } from "./wl_surface.js";
import { XdgToplevel } from "./xdg_toplevel.js";
export declare class XdgSurface extends WlObject<ExistentParent> {
    surface: WlSurface;
    role: XdgToplevel | null;
    lastConfigureSerial: number;
    wasLastConfigureAcked: boolean;
    get iface(): string;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    newSerial(): number;
    wlAckConfigure({ serial }: {
        serial: number;
    }): void;
    wlGetToplevel(): void;
}
