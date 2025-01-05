import { ExistentParent, BaseObject } from "./base_object.js";

export class WlDummy extends BaseObject {
  _iface: string = 'wl_dummy';
  get iface() { return this._iface }
  set iface(v) { this._iface = v; }
}
