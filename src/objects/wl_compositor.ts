import { WlObject } from "./wl_object.js";

const name = 'wl_compositor';
export class WlCompositor extends WlObject {
  get iface() { return name }

  createSurface() {}
  createRegion() {}
}
