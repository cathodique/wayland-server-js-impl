"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlShmPool = void 0;
const mmap_io_1 = __importDefault(require("@cathodique/mmap-io"));
const base_object_js_1 = require("./base_object.js");
const name = 'wl_shm_pool';
class WlShmPool extends base_object_js_1.BaseObject {
    get iface() { return name; }
    size;
    fd;
    daughterBuffers = new Set();
    bufferId;
    constructor(conx, oid, parent, args) {
        super(conx, oid, parent, args);
        // const readwrite = (mmap.PROT_READ | mmap.PROT_WRITE) as 3;
        // this.mmap = mmap.map(args.size, readwrite, mmap.MAP_SHARED, args.fd);
        this.size = args.size;
        this.fd = args.fd;
        this.bufferId = mmap_io_1.default.map(this.size, mmap_io_1.default.PROT_READ, mmap_io_1.default.MAP_SHARED, this.parent.fd, 0);
    }
    wlResize(args) {
        mmap_io_1.default.unmap(this.bufferId);
        this.size = args.size;
        this.bufferId = mmap_io_1.default.map(this.size, mmap_io_1.default.PROT_READ, mmap_io_1.default.MAP_SHARED, this.parent.fd, 0);
    }
    wlDestroy() {
        mmap_io_1.default.unmap(this.bufferId);
    }
}
exports.WlShmPool = WlShmPool;
