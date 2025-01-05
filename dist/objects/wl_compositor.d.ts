import { BaseObject } from "./base_object.js";
export declare class WlCompositor extends BaseObject {
    get iface(): "wl_compositor";
    wlCreateSurface(): void;
    wlCreateRegion(): void;
}
