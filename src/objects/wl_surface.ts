import { ExistentParent, WlObject } from "./base_object.js";
import { WlBuffer } from "./wl_buffer.js";
import { RegRectangle, WlRegion } from "./wl_region.js";
import { WlCallback } from "./wl_callback.js";
import { WlSubsurface } from "./wl_subsurface.js";
import mmap from "@cathodique/mmap-io";

interface DoubleBuffer<T> {
  current: T;
  cached: T | null;
  pending: T;
}

function createDoubleBuffer<T>(v: () => T) {
  return { current: v(), cached: v(), pending: v() };
}

const name = 'wl_surface' as const;
export class WlSurface extends WlObject<ExistentParent> {
  daughterSurfaces: WlSurface[] = [];
  subsurface: WlSubsurface | null = null;

  get iface() { return name }

  opaqueRegions: DoubleBuffer<RegRectangle[]> = createDoubleBuffer(() => []);
  inputRegions: DoubleBuffer<RegRectangle[]> = createDoubleBuffer(() => []);
  buffer: DoubleBuffer<WlBuffer | null> = createDoubleBuffer(() => null);
  scale: DoubleBuffer<number> = createDoubleBuffer(() => 1);

  static doubleBufferedState = ['opaqueRegions', 'inputRegions', 'buffer', 'scale'] as const;

  wlSetOpaqueRegion(args: { region: WlRegion }) {
    this.opaqueRegions.pending = args.region.instructions;
  }
  wlSetInputRegion(args: { region: WlRegion }) {
    this.inputRegions.pending = args.region.instructions;
  }

  wlFrame({ callback }: { callback: WlCallback }) {
    this.connection.compositor.once('tick', (function (this: WlSurface) {
      callback.done(Date.now());
    }).bind(this));
  }

  wlSetBufferScale(args: { scale: number }) {
    this.scale.pending = args.scale;
  }

  wlAttach(args: { buffer: WlBuffer | null }) {
    this.buffer.pending = args.buffer;
  }

  get synced(): boolean {
    if (!this.subsurface) return false;
    return this.subsurface.isSynced || this.subsurface.assocParent.synced;
  }

  update<T>() {
    for (const doubleBuffed of WlSurface.doubleBufferedState) {
      this[doubleBuffed].cached = this[doubleBuffed].pending;
    }
    if (this.subsurface && !this.subsurface.isSynced) this.applyCache();
  }
  applyCache<T>() {
    this.daughterSurfaces.forEach((surf) => surf.applyCache());

    for (const doubleBuffed of WlSurface.doubleBufferedState) {
      if (this[doubleBuffed].current instanceof WlBuffer) this[doubleBuffed].current.wlRelease();
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
    if (frame) this.connection.emit('frame', frame, this);
  }
}
