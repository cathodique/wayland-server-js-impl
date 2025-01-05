import { ExistentParent, BaseObject } from "./base_object.js";

const name = 'wl_subcompositor' as const;
export class WlSubcompositor extends BaseObject {
  get iface() { return name }

  wlGetSubsurface() { /* Taken care of in wl_subsurface constructor */}
}
