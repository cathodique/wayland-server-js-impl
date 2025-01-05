"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseObject = void 0;
const node_events_1 = require("node:events");
class BaseObject extends node_events_1.EventEmitter {
    connection;
    oid;
    parent;
    constructor(conx, oid, parent, args) {
        super();
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
exports.BaseObject = BaseObject;
