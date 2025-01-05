"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlPointer = void 0;
const wayland_interpreter_js_1 = require("../wayland_interpreter.js");
const base_object_js_1 = require("./base_object.js");
const wl_seat_js_1 = require("./wl_seat.js");
const name = 'wl_pointer';
class WlPointer extends base_object_js_1.BaseObject {
    get iface() { return name; }
    recipient;
    latestSerial = null;
    constructor(conx, oid, parent, args) {
        super(conx, oid, parent, args);
        if (!(parent instanceof wl_seat_js_1.WlSeat))
            throw new Error('WlPointer needs to be initialized in the scope of a wl_seat');
        const seatRegistry = parent.seatRegistry;
        this.recipient = seatRegistry.transport.createRecipient();
        this.recipient.on('enter', (function (enteringSurface, surfX, surfY) {
            this.addCommand('enter', {
                serial: this.latestSerial = this.connection.time.getTime(),
                surface: enteringSurface,
                surfaceX: surfX,
                surfaceY: surfY,
            });
        }).bind(this));
        this.recipient.on('moveTo', (function (surfX, surfY) {
            this.addCommand('motion', {
                time: this.connection.time.getTime(),
                surfaceX: surfX,
                surfaceY: surfY,
            });
        }).bind(this));
        this.recipient.on('leave', (function (leavingSurface) {
            this.addCommand('leave', {
                serial: this.latestSerial = this.connection.time.getTime(),
                surface: leavingSurface,
            });
        }).bind(this));
        this.recipient.on('buttonDown', (function (button) {
            this.addCommand('button', {
                serial: this.latestSerial = this.connection.time.getTime(),
                time: this.connection.time.getTime(),
                button: button,
                state: wayland_interpreter_js_1.interfaces.wl_pointer.enums.button_state.atoi.pressed,
            });
        }).bind(this));
        this.recipient.on('buttonUp', (function (button) {
            this.addCommand('button', {
                serial: this.latestSerial = this.connection.time.getTime(),
                time: this.connection.time.getTime(),
                button: button,
                state: wayland_interpreter_js_1.interfaces.wl_pointer.enums.button_state.atoi.released,
            });
        }).bind(this));
    }
}
exports.WlPointer = WlPointer;
