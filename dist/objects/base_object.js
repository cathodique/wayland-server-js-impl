"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseObject = void 0;
const node_events_1 = require("node:events");
const utils_js_1 = require("../utils.js");
class BaseObject extends node_events_1.EventEmitter {
    connection;
    oid;
    _version;
    parent;
    constructor(conx, oid, parent, args) {
        super();
        this.oid = oid;
        this.connection = conx;
        this.parent = parent;
        if (utils_js_1.ifaceVersion in args)
            this._version = args[utils_js_1.ifaceVersion];
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
    get version() {
        if (this._version != null)
            return this._version;
        if (this.parent)
            return this.parent.version;
        throw new Error('You ask too much of an orphan...');
    }
}
exports.BaseObject = BaseObject;
