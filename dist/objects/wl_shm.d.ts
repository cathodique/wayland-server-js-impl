import { Connection } from "../connection.js";
import { WlObject } from "./wl_object.js";
export declare class WlShm extends WlObject {
    static supportedFormats: number[];
    constructor(conx: Connection, oid: number, args: Record<string, any>);
    get iface(): string;
}
