import { ExistentParent, WlObject } from "./base_object.js";

const name = 'wl_compositor' as const;
export class WlCompositor extends WlObject<ExistentParent> {
  get iface() { return name }

  wlCreateSurface() {}
  wlCreateRegion() {}
}
