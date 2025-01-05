import { BaseObject } from "./base_object.js";
export declare class WlSubcompositor extends BaseObject {
    get iface(): "wl_subcompositor";
    wlGetSubsurface(): void;
}
