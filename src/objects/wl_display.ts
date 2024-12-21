import { WlCallback } from "./wl_callback.js";
import { WlObject } from "./wl_object.js";

const name = 'wl_display';
export class WlDisplay extends WlObject {
  get iface() { return name } // We <3 JS prototype chain

  sync(args: { callback: WlCallback }) {
    args.callback.done(1);
  }
  getRegistry() { }
}
