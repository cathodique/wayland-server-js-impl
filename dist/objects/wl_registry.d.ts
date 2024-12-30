import { OutputConfiguration } from "../compositor.js";
import { Connection } from "../connection.js";
import { ExistentParent, WlObject } from "./base_object.js";
export interface ExtraOutputData extends OutputConfiguration {
    expectedIface: 'wl_output';
}
export type ExtraData = ExtraOutputData;
export declare class WlRegistry extends WlObject<ExistentParent> {
    get iface(): "wl_registry";
    static baseRegistry: (string | null)[];
    static supportedByRegistry: (string | null)[];
    registry: [string | null, ExtraData | null][];
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    getExtraData(oid: number): ExtraOutputData | null;
    wlBind(): void;
    wlGetRegistry(): void;
}
