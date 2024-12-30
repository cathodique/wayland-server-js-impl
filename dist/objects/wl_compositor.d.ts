import { ExistentParent, WlObject } from "./base_object.js";
export declare class WlCompositor extends WlObject<ExistentParent> {
    get iface(): "wl_compositor";
    wlCreateSurface(): void;
    wlCreateRegion(): void;
}
