import { WlObject } from "./wl_object.js";

const name = 'wl_buffer';
export class WlBuffer extends WlObject {
  get iface() { return name }
}
