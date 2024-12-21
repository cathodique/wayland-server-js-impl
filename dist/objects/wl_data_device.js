import { WlObject } from "./wl_object.js";
const name = 'wl_data_device';
export class WlDataDevice extends WlObject {
    seat;
    constructor(conx, oid, args) {
        super(conx, oid, args);
        this.seat = args.seat;
    }
    get iface() { return name; }
}
