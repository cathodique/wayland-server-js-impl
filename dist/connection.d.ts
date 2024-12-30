import type { Compositor } from "./compositor.js";
import { Parent, WlObject as BaseObject } from "./objects/base_object.js";
import { WlRegistry } from "./objects/wl_registry.js";
import { WlArg, WlMessage } from "./wayland_interpreter.js";
import { WlSurface } from "./objects/wl_surface.js";
import { USocket } from "@cathodique/usocket";
import FIFO from "fast-fifo";
import EventEmitter from "node:events";
export declare const endianness: "BE" | "LE";
export declare const read: (b: Buffer, i: number, signed?: boolean) => number;
export type HypotheticalObject = {
    oid: number;
};
export declare function parseOnReadable(sock: USocket, callback: ({ data, fds }: {
    data: Buffer;
    fds: number[];
}) => void): void;
interface ParsingContext {
    buf: Buffer;
    idx: number;
    fdQ: FIFO<number>;
    callbacks: ((args: Record<string, any>) => void)[];
    parent: BaseObject<Parent>;
}
export declare class Connection extends EventEmitter<{
    frame: [Buffer, WlSurface];
}> {
    compositor: Compositor;
    socket: USocket;
    socket2?: USocket;
    connId: number;
    muzzled: boolean;
    objects: Map<number, BaseObject<Parent>>;
    registry: WlRegistry | null;
    fdQ: FIFO<number>;
    constructor(connId: number, comp: Compositor, sock: USocket, muzzled: boolean);
    static prettyWlObj(object: BaseObject<any>): string;
    static prettyArgs(args: Record<string, any>): {
        [k: string]: any;
    };
    createObject(type: string, id: number, parent: BaseObject<Parent>, args: Record<string, any>): BaseObject<Parent> | Map<number, BaseObject<Parent>>;
    parseBlock(ctx: ParsingContext, type: string, arg?: WlArg): any;
    parser(buf: Buffer, isEvent?: boolean): Generator<[BaseObject<Parent>, string, Record<string, any>]>;
    buildBlock(val: any, arg: WlArg, idx: number, buf: Buffer): number;
    getFinalSize(msg: WlMessage, args: Record<string, any>): number;
    builder(obj: BaseObject<Parent>, eventName: string, args: Record<string, any>): Buffer<ArrayBuffer>;
    protected buffersSoFar: Buffer[];
    protected immediate?: NodeJS.Immediate;
    addCommand(obj: BaseObject<Parent>, eventName: string, args: Record<string, any>): void;
    protected sendPending(): void;
    destroy(obj: BaseObject<any>): void;
}
export {};
