"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XdgToplevel = void 0;
const base_object_js_1 = require("./base_object.js");
const xdg_surface_js_1 = require("./xdg_surface.js");
const name = 'xdg_toplevel';
class XdgToplevel extends base_object_js_1.WlObject {
    appId;
    assocParent = null;
    get iface() { return name; }
    constructor(conx, oid, parent, args) {
        if (!(parent instanceof xdg_surface_js_1.XdgSurface))
            throw new Error('Parent must be xdg_surface');
        super(conx, oid, parent, args);
        parent.role = this;
    }
    wlSetAppId(args) {
        this.appId = args.appId;
    }
    wlSetParent(args) {
        // TODO: Check if is mapped
        this.assocParent = args.parent;
    }
    get renderReady() {
        // Check if the top-level has been set-up enough to be render-ready
        return true;
    }
}
exports.XdgToplevel = XdgToplevel;
