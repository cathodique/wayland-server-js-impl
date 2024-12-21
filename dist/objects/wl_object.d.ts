import { Connection } from "../connection.js";
export declare class WlObject {
    connection: Connection;
    oid: number;
    constructor(conx: Connection, oid: number, args: Record<string, any>);
    get iface(): string;
    destroy(): void;
}
