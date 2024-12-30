"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlSubsurface = void 0;
const base_object_js_1 = require("./base_object.js");
const name = 'wl_subsurface';
class WlSubsurface extends base_object_js_1.WlObject {
    get iface() { return name; }
    assocSurface;
    assocParent;
    isSynced;
    constructor(conx, oid, parent, args) {
        super(conx, oid, parent, args);
        this.assocSurface = args.surface;
        this.assocSurface.subsurface = this;
        this.isSynced = true;
        this.assocParent = args.parent;
        args.parent.daughterSurfaces.push(args.surface);
    }
    wlSetDesync() { this.isSynced = false; }
    wlSetSync() { this.isSynced = true; }
}
exports.WlSubsurface = WlSubsurface;
