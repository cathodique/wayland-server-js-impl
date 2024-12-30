import { Connection } from "../connection.js";
import { ExistentParent, WlObject } from "./base_object.js";
import { WlSeat } from "./wl_seat.js";
export declare class WlDataDevice extends WlObject<ExistentParent> {
    seat: WlSeat;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    get iface(): "wl_data_device";
}
