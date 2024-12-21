import { WlObject } from "./wl_object.js";
const name = 'xdg_toplevel';
export class XdgToplevel extends WlObject {
    appId;
    get iface() { return name; }
    setAppId(args) {
        this.appId = args.appId;
    }
}
