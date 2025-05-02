import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
export declare class XdgPopup extends BaseObject {
    appId?: string;
    get iface(): "xdg_popup";
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    get renderReady(): boolean;
}
