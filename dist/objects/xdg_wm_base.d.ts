import { Connection } from "../connection.js";
import { WlObject } from "./wl_object.js";
import { WlSurface } from "./wl_surface.js";
export declare class XdgWmBase extends WlObject {
    wlSurface: WlSurface;
    get iface(): string;
    constructor(conx: Connection, oid: number, args: Record<string, any>);
    getXdgSurface(): void;
}
