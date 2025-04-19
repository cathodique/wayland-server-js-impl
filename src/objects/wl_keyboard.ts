import path from "path/posix";
import { ObjectMetadata } from "../compositor.js";
import { Connection } from "../connection.js";
import { EventClient, EventServer } from "../lib/event_clientserver.js";
import { Signalbound } from "../lib/signalbound.js";
import { BaseObject, ExistentParent } from "./base_object.js";

import { createId } from "@paralleldrive/cuid2";

// TODO: Remove dependency on NodeJS fs
import { promises as fsp } from "fs";
import { FileHandle } from "fs/promises";
import { interfaces } from "../wayland_interpreter.js";
// import mmap from "@cathodique/mmap-io";

type KeyboardServerToClient = { 'edit_keymap': [] };
export type KeyboardEventServer = EventServer<KeyboardServerToClient, {}>;
export type KeyboardEventClient = EventClient<{}, KeyboardServerToClient>;

interface KeyboardConfiguration {
  keymap: string;
}
export class KeyboardRegistry extends Signalbound<KeyboardConfiguration, KeyboardEventServer> {
  get iface() { return name }

  keymapFd: Promise<number>;
  fileHandle: FileHandle | null = null;
  size: number | null = null;
  recipient = this.transport.createRecipient();

  constructor(v: KeyboardConfiguration) {
    super(v);
    this.keymapFd = this.loadKeymapFd();
    this.recipient.on('edit_keymap', (function (this: KeyboardRegistry) {
      this.keymapFd = this.loadKeymapFd();
    }).bind(this));
  }

  async loadKeymapFd() {
    this.fileHandle = null;
    this.size = null;
    const keymap = await fsp.readFile(`/usr/share/X11/xkb/symbols/${this.v.keymap}`);
    const newFile = path.join(`${process.env.XDG_RUNTIME_DIR || `/tmp/${process.pid}/`}`, `keymap-${createId()}`);
    await fsp.writeFile(newFile, Buffer.concat([keymap, Buffer.from([0x00])]));
    this.fileHandle = await fsp.open(newFile, 'r', 0o600);

    this.size = keymap.length;

    return this.fileHandle.fd;
  }
}
export type WlKeyboardMetadata = KeyboardRegistry;

const name = 'wl_keyboard' as const;
export class WlKeyboard extends BaseObject {
  get iface() { return name }

  meta: KeyboardRegistry;

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>, argsFromAbove: ObjectMetadata) {
    // if (conx.registry) return conx.registry;
    super(conx, oid, parent, args);

    this.meta = argsFromAbove.wl_keyboard;

    this.announceKeymap();
  }

  async announceKeymap() {
    const keymapFd = await this.meta.keymapFd;
    this.addCommand('keymap', {
      format: interfaces.wl_keyboard.enums.keymapFormat.atoi.xkb_v1,
      size: this.meta.size,
      fd: keymapFd,
    });
  }
}
