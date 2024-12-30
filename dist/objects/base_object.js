"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlObject = void 0;
class WlObject {
    connection;
    oid;
    parent;
    constructor(conx, oid, parent, args) {
        this.oid = oid;
        this.connection = conx;
        this.parent = parent;
    }
    get iface() { throw new Error('wl_object alone does not have a name'); }
    wlDestroy() {
        this.connection.destroy(this);
    }
    toString() {
        return `[wlObject ${this.iface}]`;
    }
    addCommand(eventName, args) {
        this.connection.addCommand(this, eventName, args);
    }
}
exports.WlObject = WlObject;
