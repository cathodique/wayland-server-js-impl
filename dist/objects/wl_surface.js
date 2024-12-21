import { WlObject } from "./wl_object.js";
function createDoubleBuffer(v) {
    return { current: v(), pending: v() };
}
function update(v, newPending) {
    v.current = v.pending;
    if (newPending != null)
        v.pending = newPending;
}
const name = 'wl_surface';
export class WlSurface extends WlObject {
    get iface() { return name; }
    opaqueRegions = createDoubleBuffer(() => []);
    inputRegions = createDoubleBuffer(() => []);
    buffers = createDoubleBuffer(() => null);
    setOpaqueRegion(args) {
        this.opaqueRegions.pending = args.region.instructions;
    }
    setInputRegion(args) {
        this.inputRegions.pending = args.region.instructions;
    }
    scale = createDoubleBuffer(() => 1);
    setBufferScale(args) {
        this.scale.pending = args.scale;
    }
    commit(args) {
        // The attached wl_buffer, or the pixels making up the content of the surface
        update(this.buffers);
        // The region which was "damaged" since the last frame, and needs to be redrawn
        // The region which accepts input events
        update(this.inputRegions);
        // The region considered opaque
        update(this.opaqueRegions);
        // Transformations on the attached wl_buffer, to rotate or present a subset of the buffer
        // The scale factor of the buffer, used for HiDPI displays
        update(this.scale);
    }
}
