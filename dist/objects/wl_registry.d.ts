import { EventEmitter } from "node:stream";
import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { OutputRegistry } from "./wl_output.js";
import { ObjectMetadata } from "../compositor.js";
import { SeatRegistry } from "./wl_seat.js";
import { EventServer } from "../lib/event_clientserver.js";
export declare class SpecificRegistry<T, U extends EventServer<Record<string, any[]>, Record<string, any[]>>> extends EventEmitter<{
    'new': [T];
    'del': [T];
}> {
    map: Map<number, T>;
    get iface(): string;
    vs: Set<T>;
    transport: U;
    constructor(vs: T[]);
    add(v: T): void;
    delete(v: T): void;
    addTo(r: WlRegistry, v: T): void;
    unmount: Map<WlRegistry, Map<"new" | "del", (v: T) => void>>;
    applyTo(reg: WlRegistry): void;
    unapplyTo(reg: WlRegistry): void;
}
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
