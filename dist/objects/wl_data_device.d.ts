import { Connection } from "../connection.js";
import { WlObject } from "./wl_object.js";
import { WlSeat } from "./wl_seat.js";
export declare class WlDataDevice extends WlObject {
    seat: WlSeat;
    constructor(conx: Connection, oid: number, args: Record<string, any>);
    get iface(): string;
}
