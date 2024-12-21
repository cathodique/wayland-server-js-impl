import { WlObject } from "./wl_object.js";

const name = 'wl_subsurface';
export class WlSubsurface extends WlObject {
  get iface() { return name }
}
