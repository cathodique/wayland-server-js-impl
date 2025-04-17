import { ObjectMetadata } from "../compositor.js";
import { Connection } from "../connection.js";
import { EventClient, EventServer } from "../lib/event_clientserver.js";
import { Signalbound } from "../lib/signalbound.js";
import { BaseObject, ExistentParent } from "./base_object.js";
import { FileHandle } from "fs/promises";
type KeyboardServerToClient = {
    'edit_keymap': [];
};
export type KeyboardEventServer = EventServer<KeyboardServerToClient, {}>;
export type KeyboardEventClient = EventClient<{}, KeyboardServerToClient>;
interface KeyboardConfiguration {
    keymap: string;
}
export declare class KeyboardRegistry extends Signalbound<KeyboardConfiguration, KeyboardEventServer> {
    get iface(): "wl_keyboard";
    keymapFd: Promise<number>;
    fileHandle: FileHandle | null;
    size: number | null;
    recipient: EventClient<{}, KeyboardServerToClient>;
    constructor(v: KeyboardConfiguration);
    loadKeymapFd(): Promise<number>;
}
export type WlKeyboardMetadata = KeyboardRegistry;
export declare class WlKeyboard extends BaseObject {
    get iface(): "wl_keyboard";
    meta: KeyboardRegistry;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>, argsFromAbove: ObjectMetadata);
    announceKeymap(): Promise<void>;
}
export {};
