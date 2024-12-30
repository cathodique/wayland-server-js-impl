import { Compositor } from "../compositor.js";

const compo = new Compositor([{ x: 0, y: 0, w: 1920, h: 1080 }]);
setInterval(() => {
  compo.emit('tick');
}, 1000 / 60);
compo.start();
