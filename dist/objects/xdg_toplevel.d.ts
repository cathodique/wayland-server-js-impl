import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
export declare class XdgToplevel extends BaseObject {
    appId?: string;
    assocParent: XdgToplevel | null;
    get iface(): "xdg_toplevel";
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    wlSetAppId(args: {
        appId: string;
    }): void;
    wlSetParent(args: {
        parent: XdgToplevel;
    }): void;
    get renderReady(): boolean;
}
