import { Connection } from "../connection.js";
import { BaseObject, ExistentParent } from "./base_object.js";
import { SeatEventClient } from "./wl_seat.js";
export declare class WlPointer extends BaseObject {
    get iface(): "wl_pointer";
    recipient: SeatEventClient;
    latestSerial: number | null;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
}
