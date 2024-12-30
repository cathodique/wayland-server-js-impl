import { WlCallback } from "./wl_callback.js";
import { WlObject } from "./base_object.js";
import { WlRegistry } from "./wl_registry.js";

const name = 'wl_display' as const;
export class WlDisplay extends WlObject<null> {
  get iface() { return name } // We <3 JS prototype chain

  wlSync(args: { callback: WlCallback }) {
    args.callback.done(1);
  }
  wlGetRegistry(args: { registry: WlRegistry }) {
    this.connection.registry = args.registry;
  }
}
