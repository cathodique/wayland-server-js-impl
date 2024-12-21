import { endianness as getEndianness } from "node:os";
import { WlRegistry } from "./objects/wl_registry.js";
import { WlCallback } from "./objects/wl_callback.js";
import { WlDisplay } from "./objects/wl_display.js";
import { interfaces } from "./wayland_interpreter.js";
import { WlCompositor } from "./objects/wl_compositor.js";
import { WlShm } from "./objects/wl_shm.js";
import { WlOutput } from "./objects/wl_output.js";
import { WlSubcompositor } from "./objects/wl_subcompositor.js";
import { WlSeat } from "./objects/wl_seat.js";
import { XdgWmBase } from "./objects/xdg_wm_base.js";
import { WlDataDeviceManager } from "./objects/wl_data_device_manager.js";
import { WlDataDevice } from "./objects/wl_data_device.js";
import { WlSurface } from "./objects/wl_surface.js";
import { WlRegion } from "./objects/wl_region.js";
import { XdgSurface } from "./objects/xdg_surface.js";
import { XdgToplevel } from "./objects/xdg_toplevel.js";
import { WlSubsurface } from "./objects/wl_subsurface.js";
const endianness = getEndianness();
const read = (b, i, signed = true) => {
    const unsignedness = signed ? '' : 'U';
    return b[`read${unsignedness}Int32${endianness}`](i);
};
const write = (v, b, i, signed = true) => {
    const unsignedness = signed ? '' : 'U';
    return b[`write${unsignedness}Int32${endianness}`](v, i);
};
const newIdMap = {
    wl_registry: WlRegistry,
    wl_callback: WlCallback,
    wl_compositor: WlCompositor,
    wl_shm: WlShm,
    wl_seat: WlSeat,
    wl_subcompositor: WlSubcompositor,
    wl_output: WlOutput,
    xdg_wm_base: XdgWmBase,
    wl_data_device_manager: WlDataDeviceManager,
    wl_data_device: WlDataDevice,
    wl_surface: WlSurface,
    wl_subsurface: WlSubsurface,
    xdg_surface: XdgSurface,
    xdg_toplevel: XdgToplevel,
    wl_region: WlRegion,
};
export class Connection {
    compositor;
    socket;
    socket2;
    connId;
    muzzled;
    objects;
    constructor(connId, comp, sock, sock2) {
        if (sock2)
            console.log('Received sock2; now playing MITM');
        this.connId = connId;
        this.compositor = comp;
        this.socket = sock;
        this.socket2 = sock2;
        this.muzzled = Boolean(sock2);
        this.objects = new Map([[1, new WlDisplay(this, 1, {})]]);
        // Handle data from the client
        sock.on('data', (async function (data) {
            try {
                console.log('C2S', data.toString('hex'));
                for (const [obj, method, args] of this.parser(data)) {
                    console.log(this.connId, 'C --> S', obj.iface, obj.oid, method);
                    if (!(method in obj) || sock2) {
                        // console.error('Unimplemented method:', method, 'in', obj.iface);
                    }
                    else {
                        obj[method](args);
                    }
                }
            }
            catch (err) {
                console.error(err);
                sock.end();
            }
        }).bind(this));
        if (sock2) {
            sock2.on('data', (async function (data) {
                try {
                    for (const [obj, method, args] of this.parser(data, true)) {
                        console.log(this.connId, 'S --> C', obj.iface, obj.oid, method, args);
                    }
                }
                catch (err) {
                    console.error(err);
                    sock.end();
                }
            }).bind(this));
        }
        // Handle client disconnect
        sock.on('end', () => {
            // console.log('Client disconnected');
        });
    }
    createObject(type, id, args) {
        if (this.objects.has(id))
            throw new Error(`Tried to recreate existant OID ${id}`);
        if (!(type in newIdMap))
            throw new Error(`Tried to create object of unknown type ${type}`);
        // console.log('New', type, 'with id', id);
        const newOfIface = new newIdMap[type](this, id, args);
        this.objects.set(id, newOfIface);
        return newOfIface;
    }
    parseBlock(type, idx, buf, iface) {
        // console.log(arg, idx, buf)
        switch (type) {
            case "int": {
                return [read(buf, idx, true), idx + 4];
            }
            case "uint": {
                return [read(buf, idx), idx + 4];
            }
            case "fixed": {
                return [read(buf, idx, true) / 2 ** 8, idx + 4];
            }
            case "object": {
                const hypotheticalOID = read(buf, idx);
                const object = this.objects.get(hypotheticalOID);
                if (!object)
                    throw new Error(`Client mentionned inexistant OID ${hypotheticalOID}`);
                return [object, idx + 4];
            }
            case "new_id": {
                if (iface) {
                    const oid = read(buf, idx);
                    return [null, idx + 4, (args) => this.createObject(iface, oid, args)];
                }
                else {
                    const [ifaceName, idxPrime] = this.parseBlock("string", idx, buf);
                    const [ifaceVersion, idxSecond] = this.parseBlock("uint", idxPrime, buf);
                    const [oid, idxThird] = this.parseBlock("uint", idxSecond, buf);
                    console.log(ifaceName);
                    const knownVersion = interfaces[ifaceName].version;
                    if (knownVersion < ifaceVersion) {
                        throw new Error(`Of ${ifaceName}: version ${ifaceVersion} is incompatible with version ${knownVersion}`);
                    }
                    return [null, idxThird, (args) => this.createObject(ifaceName, oid, args)];
                }
            }
            case "string": {
                const size = read(buf, idx);
                const string = buf.subarray(idx + 4, idx + size + 3);
                return [string.toString(), Math.ceil((idx + size) / 4) * 4 + 4];
            }
            case "array": {
                const size = read(buf, idx);
                const buffer = buf.subarray(idx + 4, idx + size + 4);
                return [buffer, Math.ceil((idx + size) / 4) * 4 + 4];
            }
            default:
                throw new Error(`While parsing message: unknown type ${type}`);
        }
    }
    *parser(buf, isEvent) {
        const header = (isEvent ? 'S2C' : 'C2S');
        let newCommandAt = 0;
        while (newCommandAt < buf.length) {
            const objectId = read(buf, newCommandAt + 0);
            // console.log(this.connId, header, objectId);
            const opcodeAndSize = read(buf, newCommandAt + 4);
            const opcode = opcodeAndSize % 2 ** 16;
            const size = opcodeAndSize >> 16;
            const relevantObject = this.objects.get(objectId);
            if (relevantObject == null)
                throw new Error('Client tried to invoke an operation on an unknown object');
            // console.log(relevantObject);
            const relevantIface = relevantObject.iface;
            const relevantScope = interfaces[relevantIface][isEvent ? 'events' : 'requests'];
            const { name: commandName, args: signature } = relevantScope[opcode];
            const argsResult = {};
            const callbacks = [];
            let currentIndex = newCommandAt + 8;
            for (const arg of signature) {
                // console.log(arg);
                let argResult, callback;
                [argResult, currentIndex, callback] = this.parseBlock(arg.type, currentIndex, buf, 'interface' in arg ? arg.interface : undefined);
                argsResult[arg.name] = argResult;
                if (callback)
                    callbacks.push([arg.name, callback]);
            }
            for (const [argName, callback] of callbacks) {
                argsResult[argName] = callback(argsResult);
            }
            yield [relevantObject, commandName, argsResult];
            newCommandAt += size;
        }
        if (newCommandAt !== buf.length)
            throw new Error('Possibly missing data');
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
                const size = 1 + val.length;
                const string = val;
                write(size, buf, idx);
                buf.write(string, idx + 4, 'utf-8');
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
            if (['int', 'uint', 'new_id', 'object'].includes(arg.type)) {
                result += 4;
                continue;
            }
            result += Math.ceil((args[arg.name].length + 1) / 4) * 4 + 4;
        }
        return result;
    }
    builder(obj, eventName, args) {
        const msg = interfaces[obj.iface].eventsReverse[eventName];
        // console.log(eventName, args)
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
        console.log('S2C', resBuf.toString('hex'));
        // console.log('flushed', this.buffersSoFar.length, 'buffers');
        this.buffersSoFar = [];
        this.immediate = undefined;
    }
}
