import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { WlSeat } from "./wl_seat.js";

const name = 'wl_data_device' as const;
export class WlDataDevice extends BaseObject {
  seat: WlSeat;

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);
    this.seat = args.seat;
  }

  get iface() { return name }
}
