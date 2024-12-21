import { WlObject } from "./wl_object.js";
import { WlBuffer } from "./wl_buffer.js";
import { RegRectangle, WlRegion } from "./wl_region.js";

interface DoubleBuffer<T> {
  current: T;
  pending: T;
}

function createDoubleBuffer<T>(v: () => T) {
  return { current: v(), pending: v() };
}
function update<T>(v: DoubleBuffer<T>, newPending?: T) {
  v.current = v.pending;
  if (newPending != null) v.pending = newPending;
}

const name = 'wl_surface';
export class WlSurface extends WlObject {
  get iface() { return name }

  opaqueRegions: DoubleBuffer<RegRectangle[]> = createDoubleBuffer(() => []);
  inputRegions: DoubleBuffer<RegRectangle[]> = createDoubleBuffer(() => []);
  buffers: DoubleBuffer<WlBuffer | null> = createDoubleBuffer(() => null);

  setOpaqueRegion(args: { region: WlRegion }) {
    this.opaqueRegions.pending = args.region.instructions;
  }
  setInputRegion(args: { region: WlRegion }) {
    this.inputRegions.pending = args.region.instructions;
  }

  scale: DoubleBuffer<number> = createDoubleBuffer(() => 1);
  setBufferScale(args: { scale: number }) {
    this.scale.pending = args.scale;
  }

  commit(args: {}) {
    // The attached wl_buffer, or the pixels making up the content of the surface
    update(this.buffers)
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
