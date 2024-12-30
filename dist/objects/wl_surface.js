"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlSurface = void 0;
const base_object_js_1 = require("./base_object.js");
const wl_buffer_js_1 = require("./wl_buffer.js");
function createDoubleBuffer(v) {
    return { current: v(), cached: v(), pending: v() };
}
const name = 'wl_surface';
class WlSurface extends base_object_js_1.WlObject {
    daughterSurfaces = [];
    subsurface = null;
    get iface() { return name; }
    opaqueRegions = createDoubleBuffer(() => []);
    inputRegions = createDoubleBuffer(() => []);
    buffer = createDoubleBuffer(() => null);
    scale = createDoubleBuffer(() => 1);
    static doubleBufferedState = ['opaqueRegions', 'inputRegions', 'buffer', 'scale'];
    wlSetOpaqueRegion(args) {
        this.opaqueRegions.pending = args.region.instructions;
    }
    wlSetInputRegion(args) {
        this.inputRegions.pending = args.region.instructions;
    }
    wlFrame({ callback }) {
        this.connection.compositor.once('tick', (function () {
            callback.done(Date.now());
        }).bind(this));
    }
    wlSetBufferScale(args) {
        this.scale.pending = args.scale;
    }
    wlAttach(args) {
        this.buffer.pending = args.buffer;
    }
    get synced() {
        if (!this.subsurface)
            return false;
        return this.subsurface.isSynced || this.subsurface.assocParent.synced;
    }
    update() {
        for (const doubleBuffed of WlSurface.doubleBufferedState) {
            this[doubleBuffed].cached = this[doubleBuffed].pending;
        }
        if (this.subsurface && !this.subsurface.isSynced)
            this.applyCache();
    }
    applyCache() {
        this.daughterSurfaces.forEach((surf) => surf.applyCache());
        for (const doubleBuffed of WlSurface.doubleBufferedState) {
            if (this[doubleBuffed].current instanceof wl_buffer_js_1.WlBuffer)
                this[doubleBuffed].current.wlRelease();
            if (this[doubleBuffed].cached != null) {
                this[doubleBuffed].current = this[doubleBuffed].cached;
            }
            this[doubleBuffed].cached = null;
        }
    }
    wlCommit() {
        this.update();
        const frame = this.buffer.current?.read();
        // console.log(frame);
        if (frame)
            this.connection.emit('frame', frame, this);
    }
}
exports.WlSurface = WlSurface;
