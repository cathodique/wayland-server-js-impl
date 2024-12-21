import { Connection } from "../connection.js";
import { WlObject } from "./wl_object.js";
import { WlSeat } from "./wl_seat.js";

const name = 'wl_data_device';
export class WlDataDevice extends WlObject {
  seat: WlSeat;

  constructor(conx: Connection, oid: number, args: Record<string, any>) {
    super(conx, oid, args);
    this.seat = args.seat;
  }

  get iface() { return name }
}
