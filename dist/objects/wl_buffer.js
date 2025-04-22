"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlBuffer = void 0;
const colorspaces_js_1 = require("../misc/colorspaces.js");
const wayland_interpreter_js_1 = require("../wayland_interpreter.js");
const base_object_js_1 = require("./base_object.js");
const wl_shm_pool_js_1 = require("./wl_shm_pool.js");
const fs_1 = __importDefault(require("fs"));
const name = 'wl_buffer';
class WlBuffer extends base_object_js_1.BaseObject {
    get iface() { return name; }
    offset;
    width;
    height;
    stride;
    format;
    // buffer: Promise<FileHandle>;
    constructor(conx, oid, parent, args) {
        super(conx, oid, parent, args);
        if (!(this.parent instanceof wl_shm_pool_js_1.WlShmPool))
            throw new Error('wl_buffer must only be created using wl_shm_pool.create_buffer');
        this.parent.daughterBuffers.add(this);
        this.offset = args.offset;
        this.width = args.width;
        this.height = args.height;
        this.stride = args.stride;
        this.format = args.format;
        // this.bufferId = mmap.map(this.size, mmap.PROT_READ, mmap.MAP_SHARED, (this.parent as WlShmPool).fd, this.offset);
    }
    wlRelease() {
        this.parent.daughterBuffers.delete(this);
    }
    wlDestroy() {
        // mmap.unmap(this.bufferId);
    }
    get pixelSize() {
        return colorspaces_js_1.colorspaces[wayland_interpreter_js_1.interfaces.wl_shm.enums.format.itoa[this.format]].bytesPerPixel;
    }
    get size() {
        return Math.max(this.stride * (this.height - 1) + this.width * this.pixelSize, 0);
    }
    async read() {
        const buffer = Buffer.alloc(this.size);
        // console.log((this.parent as WlShmPool).size);
        return new Promise((r) => fs_1.default.read(this.parent.fd, buffer, 0, this.size, this.offset, (_, __, b) => r(b)));
    }
}
exports.WlBuffer = WlBuffer;
