import type { Compositor } from "./compositor.js";
import { Parent, BaseObject as BaseObject, DefaultEventMap } from "./objects/base_object.js";
import { WlRegistry } from "./objects/wl_registry.js";
import { WlArg, WlMessage } from "./wayland_interpreter.js";
import { USocket } from "@cathodique/usocket";
import FIFO from "fast-fifo";
import { WlDummy } from "./objects/dummy_object.js";
import { newIdMap } from "./new_id_map.js";
import { Time } from "./lib/time.js";
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
    parent: BaseObject<DefaultEventMap, Parent>;
}
type ConnectionEvents = {
    [k in keyof typeof newIdMap]: [InstanceType<typeof newIdMap[k]>];
};
export declare class Connection extends EventEmitter<ConnectionEvents> {
    compositor: Compositor;
    socket: USocket;
    socket2?: USocket;
    connId: number;
    muzzled: boolean;
    objects: Map<number, BaseObject<DefaultEventMap, Parent>>;
    registry: WlRegistry | null;
    fdQ: FIFO<number>;
    time: Time;
    constructor(connId: number, comp: Compositor, sock: USocket, muzzled: boolean);
    static prettyWlObj(object: BaseObject<DefaultEventMap, any>): string;
    static prettyArgs(args: Record<string, any>): {
        [k: string]: any;
    };
    createObject(type: string, id: number, parent: BaseObject<DefaultEventMap, Parent>, args: Record<string, any>): import("./objects/wl_callback.js").WlCallback | import("./objects/wl_buffer.js").WlBuffer | import("./objects/wl_pointer.js").WlPointer | import("./objects/wl_keyboard.js").WlKeyboard | WlRegistry | import("./objects/wl_compositor.js").WlCompositor | import("./objects/wl_shm.js").WlShm | import("./objects/wl_shm_pool.js").WlShmPool | import("./objects/wl_seat.js").WlSeat | import("./objects/wl_subcompositor.js").WlSubcompositor | import("./objects/wl_output.js").WlOutput | import("./objects/xdg_wm_base.js").XdgWmBase | import("./objects/wl_data_device_manager.js").WlDataDeviceManager | import("./objects/wl_data_device.js").WlDataDevice | import("./objects/wl_data_offer.js").WlDataOffer | import("./objects/wl_surface.js").WlSurface | import("./objects/wl_subsurface.js").WlSubsurface | import("./objects/xdg_positioner.js").XdgPositioner | import("./objects/xdg_surface.js").XdgSurface | import("./objects/xdg_toplevel.js").XdgToplevel | import("./objects/wl_region.js").WlRegion | WlDummy;
    parseBlock(ctx: ParsingContext, type: string, arg?: WlArg): any;
    parser(buf: Buffer, isEvent?: boolean): Generator<[BaseObject<DefaultEventMap, Parent>, string, Record<string, any>]>;
    buildBlock(val: any, arg: WlArg, idx: number, buf: Buffer): number;
    getFinalSize(msg: WlMessage, args: Record<string, any>): number;
    builder(obj: BaseObject<DefaultEventMap, Parent>, eventName: string, args: Record<string, any>): Buffer<ArrayBuffer>;
    static isVersionAccurate(obj: BaseObject<DefaultEventMap, Parent>, eventName: string): boolean;
    protected buffersSoFar: Buffer[];
    addCommand(obj: BaseObject<DefaultEventMap, Parent>, eventName: string, args: Record<string, any>): boolean;
    sendPending(): void;
    destroy(obj: BaseObject<DefaultEventMap, any>): void;
    latestServerOid: number;
    createServerOid(): number;
}
export {};
