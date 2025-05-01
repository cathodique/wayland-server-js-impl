import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { WlBuffer } from "./wl_buffer.js";
export declare class WlShmPool extends BaseObject {
    get iface(): "wl_shm_pool";
    size: number;
    fd: number;
    daughterBuffers: Set<WlBuffer>;
    bufferId: number;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    wlResize(args: Record<string, any>): void;
    wlDestroy(): void;
}
