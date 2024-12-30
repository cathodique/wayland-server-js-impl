import { OutputConfiguration } from "../compositor.js";
import { Connection } from "../connection.js";
import { ExistentParent, WlObject } from "./base_object.js";
export declare class WlOutput extends WlObject<ExistentParent> {
    get iface(): "wl_output";
    outputConfig: OutputConfiguration;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
}
