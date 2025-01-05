import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { WlSeat } from "./wl_seat.js";
export declare class WlDataDevice extends BaseObject {
    seat: WlSeat;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    get iface(): "wl_data_device";
}
