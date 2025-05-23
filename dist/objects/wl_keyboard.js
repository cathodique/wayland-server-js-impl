"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlKeyboard = exports.KeyboardRegistry = void 0;
const posix_1 = __importDefault(require("path/posix"));
const signalbound_js_1 = require("../lib/signalbound.js");
const base_object_js_1 = require("./base_object.js");
const cuid2_1 = require("@paralleldrive/cuid2");
// TODO: Remove dependency on NodeJS fs
const fs_1 = require("fs");
const wayland_interpreter_js_1 = require("../wayland_interpreter.js");
const wl_seat_js_1 = require("./wl_seat.js");
class KeyboardRegistry extends signalbound_js_1.Signalbound {
    get iface() { return name; }
    keymapFd;
    fileHandle = null;
    size = null;
    recipient = this.transport.createRecipient();
    constructor(v) {
        super(v);
        this.keymapFd = this.loadKeymapFd();
        this.recipient.on('edit_keymap', (function () {
            this.keymapFd = this.loadKeymapFd();
        }).bind(this));
    }
    async loadKeymapFd() {
        this.fileHandle = null;
        this.size = null;
        const keymap = await fs_1.promises.readFile(`/usr/share/X11/xkb/symbols/${this.v.keymap}`);
        const newFile = posix_1.default.join(`${process.env.XDG_RUNTIME_DIR || `/tmp/${process.pid}/`}`, `keymap-${(0, cuid2_1.createId)()}`);
        await fs_1.promises.writeFile(newFile, Buffer.concat([keymap, Buffer.from([0x00])]));
        this.fileHandle = await fs_1.promises.open(newFile, 'r', 0o600);
        this.size = keymap.length;
        return this.fileHandle.fd;
    }
}
exports.KeyboardRegistry = KeyboardRegistry;
const name = 'wl_keyboard';
class WlKeyboard extends base_object_js_1.BaseObject {
    get iface() { return name; }
    recipient;
    meta;
    constructor(conx, oid, parent, args, argsFromAbove) {
        // if (conx.registry) return conx.registry;
        super(conx, oid, parent, args);
        this.meta = argsFromAbove.wl_keyboard;
        if (!(parent instanceof wl_seat_js_1.WlSeat))
            throw new Error('WlPointer needs to be initialized in the scope of a wl_seat');
        // this.announceKeymap();
        const seatRegistry = parent.seatRegistry;
        this.recipient = seatRegistry.transports.get(conx).get(parent.info).createRecipient();
        // TODO: Make more customizable (?) => Dont hardcode
        this.addCommand('repeatInfo', {
            rate: 25,
            delay: 600,
        });
        this.recipient.on('focus', (function (surf) {
            this.addCommand('enter', {
                serial: this.connection.time.getTime(),
                surface: surf,
                keys: Buffer.alloc(0),
            });
            this.connection.sendPending();
        }).bind(this));
        this.recipient.on('blur', (function (surf) {
            this.addCommand('leave', {
                serial: this.connection.time.getTime(),
                surface: surf,
            });
            this.connection.sendPending();
        }).bind(this));
    }
    async announceKeymap() {
        const keymapFd = await this.meta.keymapFd;
        console.log(keymapFd);
        this.addCommand('keymap', {
            format: wayland_interpreter_js_1.interfaces.wl_keyboard.enums.keymapFormat.atoi.xkb_v1,
            size: this.meta.size,
            fd: keymapFd,
        });
    }
}
exports.WlKeyboard = WlKeyboard;
