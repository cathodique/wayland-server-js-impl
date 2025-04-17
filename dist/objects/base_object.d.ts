import { EventEmitter } from "node:events";
import { Connection } from "../connection.js";
export type Parent = BaseObject<Record<string, any[]>, Parent> | null;
export type ExistentParent = BaseObject<Record<string, any[]>, Parent>;
export type DefaultEventMap = Record<string, any[]>;
export declare class BaseObject<T extends Record<string, any[]> = DefaultEventMap, U extends Parent = ExistentParent> extends EventEmitter<T> {
    connection: Connection;
    oid: number;
    _version?: number;
    parent: U;
    constructor(conx: Connection, oid: number, parent: U, args: Record<string, any>);
    get iface(): string;
    wlDestroy(): void;
    toString(): string;
    addCommand(eventName: string, args: Record<string, any>): void;
    get version(): number;
}
