import { WlObject } from "./wl_object.js";
import { WlBuffer } from "./wl_buffer.js";
import { RegRectangle, WlRegion } from "./wl_region.js";
interface DoubleBuffer<T> {
    current: T;
    pending: T;
}
export declare class WlSurface extends WlObject {
    get iface(): string;
    opaqueRegions: DoubleBuffer<RegRectangle[]>;
    inputRegions: DoubleBuffer<RegRectangle[]>;
    buffers: DoubleBuffer<WlBuffer | null>;
    setOpaqueRegion(args: {
        region: WlRegion;
    }): void;
    setInputRegion(args: {
        region: WlRegion;
    }): void;
    scale: DoubleBuffer<number>;
    setBufferScale(args: {
        scale: number;
    }): void;
    commit(args: {}): void;
}
export {};
