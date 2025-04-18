import { EventEmitter } from "events";
import { Connection } from "../connection";
import { EventServer } from "./event_clientserver";
import { WlRegistry } from "../objects/wl_registry.js";
export declare class SpecificRegistry<T, U extends EventServer<Record<string, any[]>, Record<string, any[]>>> extends EventEmitter<{
    'new': [T];
    'del': [T];
}> {
    map: Map<number, T>;
    get iface(): string;
    vs: Set<T>;
    transports: Map<Connection, Map<T, U>>;
    constructor(vs: T[]);
    addConnection(c: Connection): void;
    removeConnection(c: Connection): void;
    add(v: T): void;
    delete(v: T): void;
    addTo(r: WlRegistry, v: T): void;
    unmount: Map<WlRegistry, Map<"new" | "del", (v: T) => void>>;
    applyTo(reg: WlRegistry): void;
    unapplyTo(reg: WlRegistry): void;
}
