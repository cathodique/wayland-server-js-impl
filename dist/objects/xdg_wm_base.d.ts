import { Connection } from "../connection.js";
import { ExistentParent, WlObject } from "./base_object.js";
import { WlSurface } from "./wl_surface.js";
export declare class XdgWmBase extends WlObject<ExistentParent> {
    wlSurface: WlSurface;
    get iface(): string;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    wlGetXdgSurface(): void;
}
