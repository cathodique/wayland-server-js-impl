"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XdgSurface = void 0;
const base_object_js_1 = require("./base_object.js");
const name = 'xdg_surface';
class XdgSurface extends base_object_js_1.WlObject {
    surface;
    role = null;
    lastConfigureSerial = 0;
    wasLastConfigureAcked = true;
    get iface() { return name; }
    constructor(conx, oid, parent, args) {
        super(conx, oid, parent, args);
        this.surface = args.surface;
        this.addCommand('configure', { serial: this.newSerial() });
    }
    newSerial() {
        this.lastConfigureSerial += 1;
        this.wasLastConfigureAcked = false;
        return this.lastConfigureSerial;
    }
    wlAckConfigure({ serial }) {
        if (serial !== this.lastConfigureSerial)
            throw new Error('Serials do not match');
        if (this.wasLastConfigureAcked)
            throw new Error('Last configure was already acked');
        this.wasLastConfigureAcked = true;
    }
    wlGetToplevel() { }
}
exports.XdgSurface = XdgSurface;
