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
const mmap_io_1 = __importDefault(require("@cathodique/mmap-io"));
const name = 'wl_buffer';
class WlBuffer extends base_object_js_1.BaseObject {
    get iface() { return name; }
    offset;
    width;
    height;
    stride;
    format;
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
    }
    wlRelease() {
        this.parent.daughterBuffers.delete(this);
    }
    get pixelSize() {
        return colorspaces_js_1.colorspaces[wayland_interpreter_js_1.interfaces.wl_shm.enums.format.itoa[this.format]].bytesPerPixel;
    }
    get size() {
        return Math.max(this.stride * (this.height - 1) + this.width * this.pixelSize, 0);
    }
    getByte(i) {
        // console.log((this.parent as WlShmPool).size);
        return mmap_io_1.default.getbyte(this.parent.bufferId, i + this.offset);
    }
}
exports.WlBuffer = WlBuffer;
