import { ExistentParent, WlObject } from "./base_object.js";

const name = 'wl_data_device_manager' as const;
export class WlDataDeviceManager extends WlObject<ExistentParent> {
  get iface() { return name }

  wlGetDataDevice() { }
}
