import { Connection } from "../connection.js";
import { ExistentParent, WlObject } from "./base_object.js";
export declare class XdgToplevel extends WlObject<ExistentParent> {
    appId?: string;
    assocParent: XdgToplevel | null;
    get iface(): string;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    wlSetAppId(args: {
        appId: string;
    }): void;
    wlSetParent(args: {
        parent: XdgToplevel;
    }): void;
    get renderReady(): boolean;
}
