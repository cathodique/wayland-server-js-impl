"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = exports.read = exports.endianness = void 0;
exports.parseOnReadable = parseOnReadable;
const node_os_1 = require("node:os");
const base_object_js_1 = require("./objects/base_object.js");
const wl_registry_js_1 = require("./objects/wl_registry.js");
const wl_callback_js_1 = require("./objects/wl_callback.js");
const wl_display_js_1 = require("./objects/wl_display.js");
const wayland_interpreter_js_1 = require("./wayland_interpreter.js");
const wl_compositor_js_1 = require("./objects/wl_compositor.js");
const wl_shm_js_1 = require("./objects/wl_shm.js");
const wl_output_js_1 = require("./objects/wl_output.js");
const wl_subcompositor_js_1 = require("./objects/wl_subcompositor.js");
const wl_seat_js_1 = require("./objects/wl_seat.js");
const xdg_wm_base_js_1 = require("./objects/xdg_wm_base.js");
const wl_data_device_manager_js_1 = require("./objects/wl_data_device_manager.js");
const wl_data_device_js_1 = require("./objects/wl_data_device.js");
const wl_surface_js_1 = require("./objects/wl_surface.js");
const wl_region_js_1 = require("./objects/wl_region.js");
const xdg_surface_js_1 = require("./objects/xdg_surface.js");
const xdg_toplevel_js_1 = require("./objects/xdg_toplevel.js");
const wl_subsurface_js_1 = require("./objects/wl_subsurface.js");
const wl_shm_pool_js_1 = require("./objects/wl_shm_pool.js");
const fast_fifo_1 = __importDefault(require("fast-fifo"));
const utils_js_1 = require("./utils.js");
const dummy_object_js_1 = require("./objects/dummy_object.js");
const wl_buffer_js_1 = require("./objects/wl_buffer.js");
const node_events_1 = __importDefault(require("node:events"));
const logger_js_1 = require("./logger.js");
exports.endianness = (0, node_os_1.endianness)();
const read = (b, i, signed = true) => {
    const unsignedness = signed ? "" : "U";
    return b[`read${unsignedness}Int32${exports.endianness}`](i);
};
exports.read = read;
const write = (v, b, i, signed = true) => {
    const unsignedness = signed ? "" : "U";
    return b[`write${unsignedness}Int32${exports.endianness}`](v, i);
};
const newIdMap = {
    wl_buffer: wl_buffer_js_1.WlBuffer,
    wl_registry: wl_registry_js_1.WlRegistry,
    wl_callback: wl_callback_js_1.WlCallback,
    wl_compositor: wl_compositor_js_1.WlCompositor,
    wl_shm: wl_shm_js_1.WlShm,
    wl_shm_pool: wl_shm_pool_js_1.WlShmPool,
    wl_seat: wl_seat_js_1.WlSeat,
    wl_subcompositor: wl_subcompositor_js_1.WlSubcompositor,
    wl_output: wl_output_js_1.WlOutput,
    xdg_wm_base: xdg_wm_base_js_1.XdgWmBase,
    wl_data_device_manager: wl_data_device_manager_js_1.WlDataDeviceManager,
    wl_data_device: wl_data_device_js_1.WlDataDevice,
    wl_surface: wl_surface_js_1.WlSurface,
    wl_subsurface: wl_subsurface_js_1.WlSubsurface,
    xdg_surface: xdg_surface_js_1.XdgSurface,
    xdg_toplevel: xdg_toplevel_js_1.XdgToplevel,
    wl_region: wl_region_js_1.WlRegion,
};
function parseOnReadable(sock, callback) {
    try {
        while (true) {
            const { data: headerStuff, fds: fds1 } = sock.read(8, null) || {
                data: null,
                fds: null,
            };
            if (!headerStuff)
                return;
            const metadataNumber = (0, exports.read)(headerStuff, 4);
            const size = metadataNumber >> 16;
            const { data: payload, fds: fds2 } = sock.read(size - 8, null) || {
                data: null,
                fds: null,
            };
            const data = Buffer.concat([headerStuff, payload || Buffer.from([])]);
            const fds = [...(fds1 || []), ...(fds2 || [])];
            callback({ data, fds });
        }
    }
    catch (err) {
        logger_js_1.console.error(err);
    }
}
class Connection extends node_events_1.default {
    compositor;
    socket;
    socket2;
    connId;
    muzzled;
    objects;
    registry = null;
    fdQ;
    constructor(connId, comp, sock, muzzled) {
        super();
        if (muzzled)
            logger_js_1.console.log("Muzzled; Will not interfere with sockets (use for MITM)");
        this.connId = connId;
        this.compositor = comp;
        this.socket = sock;
        this.muzzled = muzzled;
        this.fdQ = new fast_fifo_1.default();
        this.objects = new Map([[1, new wl_display_js_1.WlDisplay(this, 1, null, {})]]);
        if (!muzzled) {
            // Handle data from the client
            sock.on("readable", async function () {
                parseOnReadable(sock, function ({ data, fds }) {
                    fds.forEach((fd) => this.fdQ.push(fd));
                    try {
                        // console.log("C2S", data.toString("hex"), fds);
                        for (const [obj, method, args] of this.parser(data)) {
                            logger_js_1.console.log(this.connId, "C --> S", Connection.prettyWlObj(obj), method);
                            const functionActualName = (0, utils_js_1.snakePrepend)("wl", method);
                            if (!(functionActualName in obj)) {
                                logger_js_1.console.error('Unimplemented method:', method, 'in', obj.iface);
                            }
                            else {
                                obj[functionActualName](args);
                            }
                        }
                    }
                    catch (err) {
                        logger_js_1.console.error(err);
                        sock.end();
                    }
                }.bind(this));
            }.bind(this));
        }
        // Handle client disconnect
        sock.on("end", () => {
            // console.log('Client disconnected');
        });
    }
    static prettyWlObj(object) {
        return `[${object.iface}#${object.oid}]`;
    }
    static prettyArgs(args) {
        return Object.fromEntries(Object.entries(args)
            .map(([k, v]) => [k, v instanceof base_object_js_1.WlObject ? Connection.prettyWlObj(v) : v]));
    }
    createObject(type, id, parent, args) {
        if (this.objects.has(id))
            throw new Error(`Tried to recreate existant OID ${id}`);
        if (!(type in newIdMap) && !this.muzzled)
            throw new Error(`Tried to create object of unknown type ${type}`);
        else if (!(type in newIdMap))
            return this.objects.set(id, new dummy_object_js_1.WlDummy(this, id, parent, args));
        // console.log(`New [${type}#${id}]`, Connection.prettyArgs(args));
        const newOfIface = new newIdMap[type](this, id, parent, args);
        this.objects.set(id, newOfIface);
        return newOfIface;
    }
    parseBlock(ctx, type, arg) {
        const idx = ctx.idx;
        switch (type) {
            case "int": {
                ctx.idx += 4;
                return (0, exports.read)(ctx.buf, idx, true);
            }
            case "uint": {
                ctx.idx += 4;
                return (0, exports.read)(ctx.buf, idx);
            }
            case "fixed": {
                ctx.idx += 4;
                return (0, exports.read)(ctx.buf, idx, true) / 2 ** 8;
            }
            case "object": {
                if (!arg)
                    throw new Error("Need whole arg to parse object");
                const hypotheticalOID = (0, exports.read)(ctx.buf, ctx.idx);
                ctx.idx += 4;
                if (hypotheticalOID === 0 && 'allowNull' in arg && arg.allowNull) {
                    return null;
                }
                const object = this.objects.get(hypotheticalOID);
                if (!object)
                    throw new Error(`Client mentionned inexistant OID ${hypotheticalOID}`);
                return object;
            }
            case "new_id": {
                if (!arg)
                    throw new Error("Need whole arg to parse new_id");
                if (!("interface" in arg))
                    throw new Error("new_id has no interface attribute");
                const iface = arg.interface;
                if (iface != null) {
                    const oid = (0, exports.read)(ctx.buf, ctx.idx);
                    ctx.idx += 4;
                    ctx.callbacks.push((args) => (args[arg.name] = this.createObject(iface, oid, ctx.parent, args)));
                    return;
                }
                else {
                    const ifaceName = this.parseBlock(ctx, "string");
                    const ifaceVersion = this.parseBlock(ctx, "uint");
                    const oid = this.parseBlock(ctx, "uint");
                    const knownVersion = wayland_interpreter_js_1.interfaces[ifaceName]?.version;
                    if (!this.muzzled && knownVersion < ifaceVersion) {
                        throw new Error(`Of ${ifaceName}: version ${ifaceVersion} is incompatible with version ${knownVersion}`);
                    }
                    ctx.callbacks.push((args) => (args[arg.name] = this.createObject(ifaceName, oid, ctx.parent, args)));
                    return null;
                }
            }
            case "string": {
                const size = (0, exports.read)(ctx.buf, idx);
                ctx.idx += 4;
                const string = ctx.buf.subarray(idx + 4, idx + size + 3);
                ctx.idx += Math.ceil(size / 4) * 4;
                return string.toString();
            }
            case "array": {
                const size = (0, exports.read)(ctx.buf, idx);
                ctx.idx += 4;
                const buffer = ctx.buf.subarray(idx + 4, idx + size + 4);
                ctx.idx += Math.ceil(size / 4) * 4;
                return buffer;
            }
            case "fd": {
                return ctx.fdQ.shift();
            }
            default:
                throw new Error(`While parsing message: unknown type ${type}`);
        }
    }
    *parser(buf, isEvent) {
        const header = isEvent ? "S2C" : "C2S";
        let newCommandAt = 0;
        while (newCommandAt < buf.length) {
            const objectId = (0, exports.read)(buf, newCommandAt + 0);
            // console.log(this.connId, header, objectId);
            const opcodeAndSize = (0, exports.read)(buf, newCommandAt + 4);
            const opcode = opcodeAndSize % 2 ** 16;
            const size = opcodeAndSize >> 16;
            const relevantObject = this.objects.get(objectId);
            if (relevantObject == null)
                throw new Error("Client tried to invoke an operation on an unknown object");
            // console.log(relevantObject);
            const relevantIface = relevantObject.iface;
            const relevantScope = wayland_interpreter_js_1.interfaces[relevantIface][isEvent ? "events" : "requests"];
            const { name: commandName, args: signature } = relevantScope[opcode];
            const argsResult = {};
            let currentIndex = newCommandAt + 8;
            const parsingContext = {
                buf,
                idx: currentIndex,
                callbacks: [],
                fdQ: this.fdQ,
                parent: relevantObject,
            };
            for (const arg of signature) {
                argsResult[arg.name] = this.parseBlock(parsingContext, arg.type, arg);
            }
            for (const callback of parsingContext.callbacks) {
                callback(argsResult);
            }
            yield [relevantObject, commandName, argsResult];
            newCommandAt += size;
        }
        if (newCommandAt !== buf.length)
            throw new Error("Possibly missing data");
        // return commands;
    }
    buildBlock(val, arg, idx, buf) {
        switch (arg.type) {
            case "int": {
                write(val, buf, idx, true);
                return idx + 4;
            }
            case "uint": {
                write(val, buf, idx);
                return idx + 4;
            }
            case "fixed": {
                write(val * 2 ** 8, buf, idx, true);
                return idx + 4;
            }
            case "object": {
                write(val.oid, buf, idx, true);
                return idx + 4;
            }
            case "new_id": {
                throw new Error("Is that even possible?");
            }
            case "string": {
                const size = (1 + val.length);
                const string = val;
                write(size, buf, idx);
                buf.write(string, idx + 4, "utf-8");
                return idx + 4 + Math.ceil(size / 4) * 4;
            }
            case "array": {
                const size = val.length;
                const buffer = val;
                write(size, buf, idx);
                buffer.copy(buf, idx + 1);
                return idx + 4 + Math.ceil(size / 4) * 4;
            }
        }
    }
    getFinalSize(msg, args) {
        let result = 0;
        for (const arg of msg.args) {
            if (["int", "uint", "new_id", "object"].includes(arg.type)) {
                result += 4;
                continue;
            }
            result += Math.ceil((args[arg.name].length + 1) / 4) * 4 + 4;
        }
        return result;
    }
    builder(obj, eventName, args) {
        const msg = wayland_interpreter_js_1.interfaces[obj.iface].eventsReverse[eventName];
        // console.log(eventName, interfaces[obj.iface]?.eventsReverse, args)
        const opcode = msg.index;
        const size = this.getFinalSize(msg, args) + 8;
        const result = Buffer.alloc(size);
        write(obj.oid, result, 0);
        write(size * 2 ** 16 + opcode, result, 4);
        let currIdx = 8;
        for (let i = 0; i < msg.args.length; i += 1) {
            const arg = msg.args[i];
            currIdx = this.buildBlock(args[arg.name], arg, currIdx, result);
        }
        // console.log(size * 2 ** 16 + opcode, result);
        return result;
    }
    buffersSoFar = [];
    immediate;
    addCommand(obj, eventName, args) {
        if (this.muzzled)
            return;
        const toBeSent = this.builder(obj, eventName, args);
        this.buffersSoFar.push(toBeSent);
        if (!this.immediate)
            this.immediate = setImmediate((() => this.sendPending()).bind(this));
    }
    sendPending() {
        if (this.muzzled)
            return;
        const resBuf = Buffer.concat(this.buffersSoFar);
        this.socket.write(resBuf);
        // console.log("S2C", resBuf.toString("hex"));
        // console.log('flushed', this.buffersSoFar.length, 'buffers');
        this.buffersSoFar = [];
        this.immediate = undefined;
    }
    destroy(obj) {
        this.objects.delete(obj.oid);
        this.addCommand(this.objects.get(1), 'deleteId', { id: obj.oid });
    }
}
exports.Connection = Connection;
