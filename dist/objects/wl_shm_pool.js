"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlShmPool = void 0;
const base_object_js_1 = require("./base_object.js");
const name = 'wl_shm_pool';
class WlShmPool extends base_object_js_1.WlObject {
    get iface() { return name; }
    size;
    fd;
    daughterBuffers = new Set();
    constructor(conx, oid, parent, args) {
        super(conx, oid, parent, args);
        // const readwrite = (mmap.PROT_READ | mmap.PROT_WRITE) as 3;
        // this.mmap = mmap.map(args.size, readwrite, mmap.MAP_SHARED, args.fd);
        this.size = args.size;
        this.fd = args.fd;
    }
    wlResize(args) {
        this.size = args.size;
    }
}
exports.WlShmPool = WlShmPool;
