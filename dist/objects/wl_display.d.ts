import { WlCallback } from "./wl_callback.js";
import { WlObject } from "./base_object.js";
import { WlRegistry } from "./wl_registry.js";
export declare class WlDisplay extends WlObject<null> {
    get iface(): "wl_display";
    wlSync(args: {
        callback: WlCallback;
    }): void;
    wlGetRegistry(args: {
        registry: WlRegistry;
    }): void;
}
