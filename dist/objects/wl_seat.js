import { WlObject } from "./wl_object.js";
const name = 'wl_seat';
export class WlSeat extends WlObject {
    get iface() { return name; }
}
