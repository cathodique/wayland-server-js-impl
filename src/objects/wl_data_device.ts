import { Connection } from "../connection.js";
import { fromServer } from "../utils.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { SeatEventClient, WlSeat } from "./wl_seat.js";

const name = 'wl_data_device' as const;
export class WlDataDevice extends BaseObject {
  seat: WlSeat;
  recipient: SeatEventClient;

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);
    this.seat = args.seat;

    this.recipient = this.seat.seatRegistry.transports.get(conx)!.get(this.seat.info)!.createRecipient();
    this.recipient.on('focus', function (this: WlDataDevice) {
      const newOid = this.connection.createServerOid();
      this.addCommand('dataOffer', { id: { oid: newOid } });

      // const offer = this.connection.createObject('wl_data_offer', newOid, this, { mimeType: 'text/plain;charset=utf-8', [fromServer]: true });
      this.addCommand('selection', { id: null });
    }.bind(this));
  }

  get iface() { return name }
}
