import { WlObject } from "./wl_object.js";
export declare class XdgToplevel extends WlObject {
    appId?: string;
    get iface(): string;
    setAppId(args: {
        appId: string;
    }): void;
}
