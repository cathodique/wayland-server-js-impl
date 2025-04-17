import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { WlSurface } from "./wl_surface.js";
export declare class XdgWmBase extends BaseObject {
    wlSurface: WlSurface;
    get iface(): "xdg_wm_base";
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    wlGetXdgSurface(): void;
}
