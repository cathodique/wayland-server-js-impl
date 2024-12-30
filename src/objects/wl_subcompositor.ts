import { ExistentParent, WlObject } from "./base_object.js";

const name = 'wl_subcompositor' as const;
export class WlSubcompositor extends WlObject<ExistentParent> {
  get iface() { return name }

  wlGetSubsurface() { /* Taken care of in wl_subsurface constructor */}
}
