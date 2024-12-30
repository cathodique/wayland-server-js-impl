import { ExistentParent, WlObject } from "./base_object.js";
import { Connection } from "../connection.js";
import { WlSurface } from "./wl_surface.js";
export declare class WlSubsurface extends WlObject<ExistentParent> {
    get iface(): "wl_subsurface";
    assocSurface: WlSurface;
    assocParent: WlSurface;
    isSynced: boolean;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    wlSetDesync(): void;
    wlSetSync(): void;
}
