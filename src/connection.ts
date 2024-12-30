import { endianness as getEndianness } from "node:os";
import type { Compositor } from "./compositor.js";
import { ExistentParent, Parent, WlObject as BaseObject } from "./objects/base_object.js";
import { WlRegistry } from "./objects/wl_registry.js";
import { WlCallback } from "./objects/wl_callback.js";
import { WlDisplay } from "./objects/wl_display.js";
import { interfaces, WlArg, WlMessage } from "./wayland_interpreter.js";
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

import { USocket } from "@cathodique/usocket";
import { WlShmPool } from "./objects/wl_shm_pool.js";

import FIFO from "fast-fifo";
import { snakePrepend } from "./utils.js";
import { WlDummy } from "./objects/dummy_object.js";
import { WlBuffer } from "./objects/wl_buffer.js";
import EventEmitter from "node:events";

import { console } from "./logger.js";

export const endianness = getEndianness();
export const read = (b: Buffer, i: number, signed: boolean = true) => {
  const unsignedness = signed ? "" : "U";
  return b[`read${unsignedness}Int32${endianness}`](i);
};
const write = (v: number, b: Buffer, i: number, signed: boolean = true) => {
  const unsignedness = signed ? "" : "U";
  return b[`write${unsignedness}Int32${endianness}`](v, i);
};

export type HypotheticalObject = { oid: number };

const newIdMap: Record<
  string,
  { new (comp: Connection, oid: number, parent: ExistentParent, args: Record<string, any>): BaseObject<Parent> }
> = {
  wl_buffer: WlBuffer,
  wl_registry: WlRegistry,
  wl_callback: WlCallback,
  wl_compositor: WlCompositor,
  wl_shm: WlShm,
  wl_shm_pool: WlShmPool,
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

export function parseOnReadable(
  sock: USocket,
  callback: ({ data, fds }: { data: Buffer; fds: number[] }) => void,
) {
  try {
    while (true) {
      const { data: headerStuff, fds: fds1 } = sock.read(8, null) || {
        data: null,
        fds: null,
      };
      if (!headerStuff) return;
      const metadataNumber = read(headerStuff, 4);
      const size = metadataNumber >> 16;

      const { data: payload, fds: fds2 } = sock.read(size - 8, null) || {
        data: null,
        fds: null,
      };

      const data = Buffer.concat([headerStuff, payload || Buffer.from([])]);

      const fds = [...(fds1 || []), ...(fds2 || [])];
      callback({ data, fds });
    }
  } catch (err) {
    console.error(err);
  }
}

interface ParsingContext {
  buf: Buffer;
  idx: number;
  fdQ: FIFO<number>;
  callbacks: ((args: Record<string, any>) => void)[];
  parent: BaseObject<Parent>;
}

export class Connection extends EventEmitter<{ frame: [Buffer, WlSurface] }> {
  compositor: Compositor;
  socket: USocket;
  socket2?: USocket;
  connId: number;

  muzzled: boolean;

  objects: Map<number, BaseObject<Parent>>;

  registry: WlRegistry | null = null;

  fdQ: FIFO<number>;

  constructor(
    connId: number,
    comp: Compositor,
    sock: USocket,
    muzzled: boolean,
  ) {
    super();

    if (muzzled) console.log("Muzzled; Will not interfere with sockets (use for MITM)");

    this.connId = connId;
    this.compositor = comp;
    this.socket = sock;
    this.muzzled = muzzled;

    this.fdQ = new FIFO();

    this.objects = new Map<number, BaseObject<Parent>>([[1, new WlDisplay(this, 1, null, {})]]);

    if (!muzzled) {
      // Handle data from the client
      sock.on(
        "readable",
        async function (this: Connection) {
          parseOnReadable(
            sock,
            function (
              this: Connection,
              { data, fds }: { data: Buffer; fds: number[] },
            ) {
              fds.forEach((fd) => this.fdQ.push(fd));
              try {
                // console.log("C2S", data.toString("hex"), fds);
                for (const [obj, method, args] of this.parser(data)) {
                  console.log(this.connId, "C --> S", Connection.prettyWlObj(obj), method);
                  const functionActualName = snakePrepend("wl", method);
                  if (!(functionActualName in obj)) {
                    console.error('Unimplemented method:', method, 'in', obj.iface);
                  } else {
                    (
                      obj as unknown as Record<
                        string,
                        (args: Record<string, any>) => void
                      >
                    )[functionActualName](args);
                  }
                }
              } catch (err) {
                console.error(err);
                sock.end();
              }
            }.bind(this),
          );
        }.bind(this),
      );
    }

    // Handle client disconnect
    sock.on("end", () => {
      // console.log('Client disconnected');
    });
  }

  static prettyWlObj(object: BaseObject<any>) {
    return `[${object.iface}#${object.oid}]`;
  }
  static prettyArgs(args: Record<string, any>) {
    return Object.fromEntries(
      Object.entries(args)
        .map(([k, v]) => [k, v instanceof BaseObject ? Connection.prettyWlObj(v) : v]),
    );
  }

  createObject(type: string, id: number, parent: BaseObject<Parent>, args: Record<string, any>) {
    if (this.objects.has(id))
      throw new Error(`Tried to recreate existant OID ${id}`);
    if (!(type in newIdMap) && !this.muzzled)
      throw new Error(`Tried to create object of unknown type ${type}`);
    else if (!(type in newIdMap))
      return this.objects.set(id, new WlDummy(this, id, parent, args));

    // console.log(`New [${type}#${id}]`, Connection.prettyArgs(args));
    const newOfIface = new newIdMap[type](this, id, parent, args);
    this.objects.set(id, newOfIface);
    return newOfIface;
  }

  parseBlock(ctx: ParsingContext, type: string, arg?: WlArg): any {
    const idx = ctx.idx;
    switch (type) {
      case "int": {
        ctx.idx += 4;
        return read(ctx.buf, idx, true);
      }
      case "uint": {
        ctx.idx += 4;
        return read(ctx.buf, idx);
      }
      case "fixed": {
        ctx.idx += 4;
        return read(ctx.buf, idx, true) / 2 ** 8;
      }
      case "object": {
        if (!arg) throw new Error("Need whole arg to parse object");
        const hypotheticalOID = read(ctx.buf, ctx.idx);
        ctx.idx += 4;
        if (hypotheticalOID === 0 && 'allowNull' in arg && arg.allowNull) {
          return null;
        }
        const object = this.objects.get(hypotheticalOID);
        if (!object)
          throw new Error(
            `Client mentionned inexistant OID ${hypotheticalOID}`,
          );
        return object;
      }
      case "new_id": {
        if (!arg) throw new Error("Need whole arg to parse new_id");
        if (!("interface" in arg))
          throw new Error("new_id has no interface attribute");
        const iface = arg.interface;
        if (iface != null) {
          const oid = read(ctx.buf, ctx.idx);
          ctx.idx += 4;
          ctx.callbacks.push(
            (args: Record<string, any>) =>
              (args[arg.name] = this.createObject(iface, oid, ctx.parent, args)),
          );
          return;
        } else {
          const ifaceName = this.parseBlock(ctx, "string");
          const ifaceVersion = this.parseBlock(ctx, "uint");
          const oid = this.parseBlock(ctx, "uint");

          const knownVersion = interfaces[ifaceName]?.version;
          if (!this.muzzled && knownVersion < ifaceVersion) {
            throw new Error(
              `Of ${ifaceName}: version ${ifaceVersion} is incompatible with version ${knownVersion}`,
            );
          }
          ctx.callbacks.push(
            (args: Record<string, any>) =>
              (args[arg.name] = this.createObject(ifaceName, oid, ctx.parent, args)),
          );
          return null;
        }
      }
      case "string": {
        const size = read(ctx.buf, idx);
        ctx.idx += 4;

        const string = ctx.buf.subarray(idx + 4, idx + size + 3);
        ctx.idx += Math.ceil(size / 4) * 4;
        return string.toString();
      }
      case "array": {
        const size = read(ctx.buf, idx);
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

  *parser(
    buf: Buffer,
    isEvent?: boolean,
  ): Generator<[BaseObject<Parent>, string, Record<string, any>]> {
    const header = isEvent ? "S2C" : "C2S";
    let newCommandAt = 0;
    while (newCommandAt < buf.length) {
      const objectId = read(buf, newCommandAt + 0);

      // console.log(this.connId, header, objectId);

      const opcodeAndSize = read(buf, newCommandAt + 4);
      const opcode = opcodeAndSize % 2 ** 16;
      const size = opcodeAndSize >> 16;

      const relevantObject = this.objects.get(objectId);
      if (relevantObject == null)
        throw new Error(
          "Client tried to invoke an operation on an unknown object",
        );

      // console.log(relevantObject);

      const relevantIface = relevantObject.iface;
      const relevantScope =
        interfaces[relevantIface][isEvent ? "events" : "requests"];
      const { name: commandName, args: signature } = relevantScope[opcode];

      const argsResult: Record<string, any> = {};

      let currentIndex = newCommandAt + 8;

      const parsingContext: ParsingContext = {
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
    if (newCommandAt !== buf.length) throw new Error("Possibly missing data");
    // return commands;
  }

  buildBlock(val: any, arg: WlArg, idx: number, buf: Buffer): number {
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
        const size = (1 + val.length) as number;
        const string = val;
        write(size, buf, idx);
        buf.write(string, idx + 4, "utf-8");

        return idx + 4 + Math.ceil(size / 4) * 4;
      }
      case "array": {
        const size = val.length as number;
        const buffer: Buffer = val;
        write(size, buf, idx);
        buffer.copy(buf, idx + 1);

        return idx + 4 + Math.ceil(size / 4) * 4;
      }
    }
  }

  getFinalSize(msg: WlMessage, args: Record<string, any>) {
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

  builder(obj: BaseObject<Parent>, eventName: string, args: Record<string, any>) {
    const msg = interfaces[obj.iface].eventsReverse[eventName];
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

  protected buffersSoFar: Buffer[] = [];
  protected immediate?: NodeJS.Immediate;
  addCommand(obj: BaseObject<Parent>, eventName: string, args: Record<string, any>) {
    if (this.muzzled) return;
    const toBeSent = this.builder(obj, eventName, args);
    this.buffersSoFar.push(toBeSent);
    if (!this.immediate)
      this.immediate = setImmediate((() => this.sendPending()).bind(this));
  }

  protected sendPending() {
    if (this.muzzled) return;
    const resBuf = Buffer.concat(this.buffersSoFar);
    this.socket.write(resBuf);
    // console.log("S2C", resBuf.toString("hex"));

    // console.log('flushed', this.buffersSoFar.length, 'buffers');

    this.buffersSoFar = [];
    this.immediate = undefined;
  }

  destroy(obj: BaseObject<any>) {
    this.objects.delete(obj.oid);
    this.addCommand(this.objects.get(1)!, 'deleteId', { id: obj.oid });
  }
}
