import { Connection } from "../connection.js";
import { WlObject } from "./wl_object.js";
export declare class WlRegistry extends WlObject {
    get iface(): string;
    static registry: (string | null)[];
    constructor(conx: Connection, oid: number, args: Record<string, any>);
    bind(): void;
    getRegistry(): void;
}
