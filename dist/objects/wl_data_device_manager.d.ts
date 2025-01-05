import { BaseObject } from "./base_object.js";
export declare class WlDataDeviceManager extends BaseObject {
    get iface(): "wl_data_device_manager";
    wlGetDataDevice(): void;
}
