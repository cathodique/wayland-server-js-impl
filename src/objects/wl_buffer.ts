import { Connection } from "../connection.js";
import { colorspaces } from "../misc/colorspaces.js";
import { interfaces } from "../wayland_interpreter.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { WlShmPool } from "./wl_shm_pool.js";
import mmap from "@cathodique/mmap-io";

const name = 'wl_buffer' as const;
export class WlBuffer extends BaseObject {
  get iface() { return name }

  offset: number;
  width: number;
  height: number;
  stride: number;
  format: number;

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);

    if (!(this.parent instanceof WlShmPool)) throw new Error('wl_buffer must only be created using wl_shm_pool.create_buffer');
    this.parent.daughterBuffers.add(this);

    this.offset = args.offset;
    this.width = args.width;
    this.height = args.height;
    this.stride = args.stride;
    this.format = args.format;
  }

  wlRelease() {
    (this.parent as WlShmPool).daughterBuffers.delete(this);
  }

  get pixelSize() {
    return colorspaces[
      interfaces.wl_shm.enums.format.itoa[this.format] as keyof typeof colorspaces
    ].bytesPerPixel;
  }
  get size() {
    return Math.max(this.stride * (this.height - 1) + this.width * this.pixelSize, 0);
  }

  read() {
    // console.log((this.parent as WlShmPool).size);
    return mmap.tobuffer((this.parent as WlShmPool).bufferId, this.offset, this.size);
  }
}
