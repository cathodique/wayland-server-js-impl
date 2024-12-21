import { WlObject } from "./wl_object.js";
const name = 'xdg_wm_base';
export class XdgWmBase extends WlObject {
    wlSurface;
    get iface() { return name; }
    constructor(conx, oid, args) {
        super(conx, oid, args);
        this.wlSurface = args.surface;
    }
    getXdgSurface() { }
}
