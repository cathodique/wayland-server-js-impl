import { ExistentParent, WlObject } from "./base_object.js";

const name = 'wl_dummy' as const;
export class WlDummy extends WlObject<ExistentParent> {
  get iface() { return name }
}
