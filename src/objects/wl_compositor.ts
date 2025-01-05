import { BaseObject } from "./base_object.js";

const name = 'wl_compositor' as const;
export class WlCompositor extends BaseObject {
  get iface() { return name }

  wlCreateSurface() {}
  wlCreateRegion() {}
}
