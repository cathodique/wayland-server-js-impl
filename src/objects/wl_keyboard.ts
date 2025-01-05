import { BaseObject } from "./base_object.js";

const name = 'wl_keyboard';
export class WlKeyboard extends BaseObject {
  get iface() { return name }
}
