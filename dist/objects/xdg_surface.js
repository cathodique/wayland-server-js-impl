import { WlObject } from "./wl_object.js";
const name = 'xdg_surface';
export class XdgSurface extends WlObject {
    surface;
    get iface() { return name; }
    constructor(conx, oid, args) {
        super(conx, oid, args);
        this.surface = args.suface;
    }
}
