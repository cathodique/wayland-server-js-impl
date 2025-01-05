import { ExistentParent, BaseObject } from "./base_object.js";

const name = 'wl_callback' as const;
export class WlCallback extends BaseObject {
  get iface() { return name }

  done(callbackData: number) {
    this.connection.addCommand(this, 'done', { callback_data: callbackData });
    this.connection.objects.delete(this.oid);
  }
}
