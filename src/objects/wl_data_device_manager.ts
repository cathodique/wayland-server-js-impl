import { WlObject } from "./wl_object.js";

const name = 'wl_data_device_manager';
export class WlDataDeviceManager extends WlObject {
  get iface() { return name }

  getDataDevice() { }
}
