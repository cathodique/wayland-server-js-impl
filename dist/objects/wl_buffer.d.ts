import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
export declare class WlBuffer extends BaseObject {
    get iface(): "wl_buffer";
    offset: number;
    width: number;
    height: number;
    stride: number;
    format: number;
    bufferId: number;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    wlRelease(): void;
    wlDestroy(): void;
    get pixelSize(): number;
    get size(): number;
    read(): Buffer<ArrayBufferLike>;
}
