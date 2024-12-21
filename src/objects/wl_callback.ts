import { WlObject } from "./wl_object.js";

const name = 'wl_callback';
export class WlCallback extends WlObject {
  get iface() { return name }

  done(callbackData: number) {
    this.connection.addCommand(this, 'done', { callback_data: callbackData });
    this.connection.objects.delete(this.oid);
  }
}
