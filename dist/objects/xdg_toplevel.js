"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XdgToplevel = void 0;
const base_object_js_1 = require("./base_object.js");
const xdg_surface_js_1 = require("./xdg_surface.js");
const name = 'xdg_toplevel';
class XdgToplevel extends base_object_js_1.BaseObject {
    appId;
    assocParent = null;
    get iface() { return name; }
    constructor(conx, oid, parent, args) {
        if (!(parent instanceof xdg_surface_js_1.XdgSurface))
            throw new Error('Parent must be xdg_surface');
        super(conx, oid, parent, args);
        parent.role = this;
        const config = conx.registry?.outputRegistry.current;
        if (!config)
            throw new Error('Could not fetch outputRegistry - Did you instantiate wl_output before wl_registry?');
        // TODO: Retrieve that automatically (from config or sth idk)
        this.addCommand('configureBounds', { width: config.effectiveW, height: config.effectiveH });
        this.addCommand('wmCapabilities', { capabilities: Buffer.alloc(0) });
        this.addCommand('configure', { width: 0, height: 0, states: Buffer.alloc(0) });
        parent.addCommand('configure', { serial: parent.newSerial() });
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
