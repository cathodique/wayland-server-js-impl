"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compositor_js_1 = require("../compositor.js");
const wl_keyboard_js_1 = require("../objects/wl_keyboard.js");
const wl_output_js_1 = require("../objects/wl_output.js");
const wl_seat_js_1 = require("../objects/wl_seat.js");
const compo = new compositor_js_1.Compositor({
    metadata: {
        wl_registry: {
            outputs: new wl_output_js_1.OutputRegistry([{ x: 0, y: 0, w: 1920, h: 1080, effectiveW: 1920, effectiveH: 1000 }]),
            seats: new wl_seat_js_1.SeatRegistry([{
                    name: "tis not a seat, tis a throne",
                    capabilities: 1,
                }]),
        },
        wl_keyboard: new wl_keyboard_js_1.KeyboardRegistry({
            keymap: 'fr',
        }),
    },
});
setInterval(() => {
    compo.emit('tick');
}, 1000 / 60);
compo.start();
compo.on('connection', (conx) => {
    conx.on('wl_surface', (surface) => {
        console.log(surface);
    });
});
