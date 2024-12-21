import { WlObject } from "./wl_object.js";

const name = 'wl_output';
export class WlOutput extends WlObject {
  get iface() { return name }
}
