import { BaseObject } from "./base_object.js";
export declare class WlCallback extends BaseObject {
    get iface(): "wl_callback";
    done(callbackData: number): void;
}
