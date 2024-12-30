import { Connection } from "../connection.js";
import { ExistentParent, WlObject } from "./base_object.js";
export declare class WlShm extends WlObject<ExistentParent> {
    static supportedFormats: string[];
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    wlCreatePool(): void;
    get iface(): "wl_shm";
}
