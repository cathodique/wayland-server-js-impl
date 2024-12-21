import { WlObject } from "./wl_object.js";

const name = 'wl_subcompositor';
export class WlSubcompositor extends WlObject {
  get iface() { return name }
}
