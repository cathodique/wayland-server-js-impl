import { ExistentParent, WlObject } from "./base_object.js";
import { WlBuffer } from "./wl_buffer.js";
import { RegRectangle, WlRegion } from "./wl_region.js";
import { WlCallback } from "./wl_callback.js";
import { WlSubsurface } from "./wl_subsurface.js";
interface DoubleBuffer<T> {
    current: T;
    cached: T | null;
    pending: T;
}
export declare class WlSurface extends WlObject<ExistentParent> {
    daughterSurfaces: WlSurface[];
    subsurface: WlSubsurface | null;
    get iface(): "wl_surface";
    opaqueRegions: DoubleBuffer<RegRectangle[]>;
    inputRegions: DoubleBuffer<RegRectangle[]>;
    buffer: DoubleBuffer<WlBuffer | null>;
    scale: DoubleBuffer<number>;
    static doubleBufferedState: readonly ["opaqueRegions", "inputRegions", "buffer", "scale"];
    wlSetOpaqueRegion(args: {
        region: WlRegion;
    }): void;
    wlSetInputRegion(args: {
        region: WlRegion;
    }): void;
    wlFrame({ callback }: {
        callback: WlCallback;
    }): void;
    wlSetBufferScale(args: {
        scale: number;
    }): void;
    wlAttach(args: {
        buffer: WlBuffer | null;
    }): void;
    get synced(): boolean;
    update<T>(): void;
    applyCache<T>(): void;
    wlCommit(): void;
}
export {};
