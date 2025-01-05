import { WlCallback } from "./wl_callback.js";
import { BaseObject, DefaultEventMap } from "./base_object.js";
import { WlRegistry } from "./wl_registry.js";
export declare class WlDisplay extends BaseObject<DefaultEventMap, null> {
    get iface(): "wl_display";
    wlSync(args: {
        callback: WlCallback;
    }): void;
    wlGetRegistry(args: {
        registry: WlRegistry;
    }): void;
    wlDestroy(): void;
}
