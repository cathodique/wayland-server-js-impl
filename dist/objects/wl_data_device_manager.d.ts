import { ExistentParent, WlObject } from "./base_object.js";
export declare class WlDataDeviceManager extends WlObject<ExistentParent> {
    get iface(): "wl_data_device_manager";
    wlGetDataDevice(): void;
}
