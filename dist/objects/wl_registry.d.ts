import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { OutputRegistry } from "./wl_output.js";
import { ObjectMetadata } from "../compositor.js";
import { SeatRegistry } from "./wl_seat.js";
export interface WlRegistryMetadata {
    outputs: OutputRegistry;
    seats: SeatRegistry;
}
export declare class WlRegistry extends BaseObject {
    get iface(): "wl_registry";
    static baseRegistry: (string | null)[];
    static supportedByRegistry: (string | null)[];
    registry: (string | null)[];
    outputRegistry: OutputRegistry;
    seatRegistry: SeatRegistry;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>, argsFromAbove: ObjectMetadata);
    wlBind(): void;
    wlGetRegistry(): void;
}
