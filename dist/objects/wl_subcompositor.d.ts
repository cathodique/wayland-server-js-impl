import { ExistentParent, WlObject } from "./base_object.js";
export declare class WlSubcompositor extends WlObject<ExistentParent> {
    get iface(): "wl_subcompositor";
    wlGetSubsurface(): void;
}
