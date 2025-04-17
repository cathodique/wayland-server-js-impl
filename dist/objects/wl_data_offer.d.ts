import { Connection } from "../connection.js";
import { BaseObject, ExistentParent } from "./base_object.js";
export declare class WlDataOffer extends BaseObject {
    get iface(): "wl_data_offer";
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string | symbol, any>);
}
