import { ExistentParent, BaseObject } from "./base_object.js";

const name = 'wl_data_device_manager' as const;
export class WlDataDeviceManager extends BaseObject {
  get iface() { return name }

  wlGetDataDevice() { }
}
