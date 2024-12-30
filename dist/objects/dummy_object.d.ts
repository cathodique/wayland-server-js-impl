import { ExistentParent, WlObject } from "./base_object.js";
export declare class WlDummy extends WlObject<ExistentParent> {
    get iface(): "wl_dummy";
}
