import { Socket } from "node:net";
import type { Compositor } from "./compositor.js";
import { WlObject } from "./objects/wl_object.js";
import { WlArg, WlMessage } from "./wayland_interpreter.js";
export type HypotheticalObject = {
    oid: number;
};
export declare class Connection {
    compositor: Compositor;
    socket: Socket;
    socket2?: Socket;
    connId: number;
    muzzled: boolean;
    objects: Map<number, WlObject>;
    constructor(connId: number, comp: Compositor, sock: Socket, sock2?: Socket);
    createObject(type: string, id: number, args: Record<string, any>): WlObject;
    parseBlock(type: string, idx: number, buf: Buffer, iface?: string): [any, number] | [any, number, (args: Record<string, any>) => unknown];
    parser(buf: Buffer, isEvent?: boolean): Generator<[WlObject, string, Record<string, any>]>;
    buildBlock(val: any, arg: WlArg, idx: number, buf: Buffer): number;
    getFinalSize(msg: WlMessage, args: Record<string, any>): number;
    builder(obj: WlObject, eventName: string, args: Record<string, any>): Buffer<ArrayBuffer>;
    buffersSoFar: Buffer[];
    immediate?: NodeJS.Immediate;
    addCommand(obj: WlObject, eventName: string, args: Record<string, any>): void;
    sendPending(): void;
}
