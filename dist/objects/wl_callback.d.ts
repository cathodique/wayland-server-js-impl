import { WlObject } from "./wl_object.js";
export declare class WlCallback extends WlObject {
    get iface(): string;
    done(callbackData: number): void;
}
