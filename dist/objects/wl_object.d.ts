import { Connection } from "../connection.js";
export type Parent = WlObject<Parent> | null;
export type ExistentParent = WlObject<Parent>;
export declare class WlObject<T extends Parent> {
    connection: Connection;
    oid: number;
    parent: T;
    constructor(conx: Connection, oid: number, parent: T, args: Record<string, any>);
    get iface(): string;
    wlDestroy(): void;
    toString(): string;
}
