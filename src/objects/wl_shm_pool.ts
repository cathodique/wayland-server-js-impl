import mmap from "@cathodique/mmap-io";
import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { WlBuffer } from "./wl_buffer.js";

const name = 'wl_shm_pool' as const;
export class WlShmPool extends BaseObject {
  get iface() { return name }

  size: number;
  fd: number;

  daughterBuffers: Set<WlBuffer> = new Set();

  bufferId: number;

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);

    // const readwrite = (mmap.PROT_READ | mmap.PROT_WRITE) as 3;
    // this.mmap = mmap.map(args.size, readwrite, mmap.MAP_SHARED, args.fd);
    this.size = args.size;
    this.fd = args.fd;

    this.bufferId = mmap.map(this.size, mmap.PROT_READ, mmap.MAP_SHARED, this.fd, 0);
  }

  wlResize(args: Record<string, any>) {
    mmap.unmap(this.bufferId);
    this.size = args.size;
    this.bufferId = mmap.map(this.size, mmap.PROT_READ, mmap.MAP_SHARED, this.fd, 0);
  }

  // wlDestroy(): void {
  //   mmap.unmap(this.bufferId);
  //   TODO: Unmap when appropriate
  // }
}
