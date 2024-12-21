import { WlObject } from "./wl_object.js";
export declare class WlCompositor extends WlObject {
    get iface(): string;
    createSurface(): void;
    createRegion(): void;
}
