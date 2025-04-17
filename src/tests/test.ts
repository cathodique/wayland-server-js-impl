import { Compositor } from "../compositor.js";
import { Signalbound } from "../lib/signalbound.js";
import { KeyboardRegistry } from "../objects/wl_keyboard.js";
import { OutputRegistry } from "../objects/wl_output.js";
import { SeatRegistry } from "../objects/wl_seat.js";

const compo = new Compositor({
  metadata: {
    wl_registry: {
      outputs: new OutputRegistry([{ x: 0, y: 0, w: 1920, h: 1080, effectiveW: 1920, effectiveH: 1000 }]),
      seats: new SeatRegistry([{
        name: "tis not a seat, tis a throne",
        capabilities: 1,
      }]),
    },
    wl_keyboard: new KeyboardRegistry({
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
