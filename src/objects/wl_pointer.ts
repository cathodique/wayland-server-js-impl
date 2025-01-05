import { Connection } from "../connection.js";
import { interfaces } from "../wayland_interpreter.js";
import { BaseObject, ExistentParent } from "./base_object.js";
import { SeatEventClient, WlSeat } from "./wl_seat.js";

const name = 'wl_pointer' as const;
export class WlPointer extends BaseObject {
  get iface() { return name }

  recipient: SeatEventClient;

  latestSerial: number | null = null;

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);

    if (!(parent instanceof WlSeat)) throw new Error('WlPointer needs to be initialized in the scope of a wl_seat');

    const seatRegistry = parent.seatRegistry;

    this.recipient = seatRegistry.transport.createRecipient();

    this.recipient.on('enter', (function (this: WlPointer, enteringSurface: number, surfX: number, surfY: number) {
      this.addCommand('enter', {
        serial: this.latestSerial = this.connection.time.getTime(),
        surface: enteringSurface,
        surfaceX: surfX,
        surfaceY: surfY,
      });
    }).bind(this));
    this.recipient.on('moveTo', (function (this: WlPointer, surfX: number, surfY: number) {
      this.addCommand('motion', {
        time: this.connection.time.getTime(),
        surfaceX: surfX,
        surfaceY: surfY,
      });
    }).bind(this));
    this.recipient.on('leave', (function (this: WlPointer, leavingSurface: number) {
      this.addCommand('leave', {
        serial: this.latestSerial = this.connection.time.getTime(),
        surface: leavingSurface,
      });
    }).bind(this));
    this.recipient.on('buttonDown', (function (this: WlPointer, button: number) {
      this.addCommand('button', {
        serial: this.latestSerial = this.connection.time.getTime(),
        time: this.connection.time.getTime(),
        button: button,
        state: interfaces.wl_pointer.enums.button_state.atoi.pressed,
      });
    }).bind(this));
    this.recipient.on('buttonUp', (function (this: WlPointer, button: number) {
      this.addCommand('button', {
        serial: this.latestSerial = this.connection.time.getTime(),
        time: this.connection.time.getTime(),
        button: button,
        state: interfaces.wl_pointer.enums.button_state.atoi.released,
      });
    }).bind(this));
  }
}
