import { ExistentParent, WlObject } from "./base_object.js";

const name = 'wl_seat' as const;
export class WlSeat extends WlObject<ExistentParent> {
  get iface() { return name }
}
