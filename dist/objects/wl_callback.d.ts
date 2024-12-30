import { ExistentParent, WlObject } from "./base_object.js";
export declare class WlCallback extends WlObject<ExistentParent> {
    get iface(): "wl_callback";
    done(callbackData: number): void;
}
