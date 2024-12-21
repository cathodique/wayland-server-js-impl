import { WlCallback } from "./wl_callback.js";
import { WlObject } from "./wl_object.js";
export declare class WlDisplay extends WlObject {
    get iface(): string;
    sync(args: {
        callback: WlCallback;
    }): void;
    getRegistry(): void;
}
