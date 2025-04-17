import { WlCallback } from "./wl_callback.js";
import { BaseObject, DefaultEventMap } from "./base_object.js";
import { WlRegistry } from "./wl_registry.js";

const name = 'wl_display' as const;
export class WlDisplay extends BaseObject<DefaultEventMap, null> {
  get iface() { return name } // We <3 JS prototype chain

  _version: number = 1;

  wlSync(args: { callback: WlCallback }) {
    args.callback.done(1);
  }
  wlGetRegistry(args: { registry: WlRegistry }) {
    this.connection.registry = args.registry;
  }

  wlDestroy(): void {}
}
