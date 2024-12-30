"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compositor_js_1 = require("../compositor.js");
const compo = new compositor_js_1.Compositor([{ x: 0, y: 0, w: 1920, h: 1080 }]);
setInterval(() => {
    compo.emit('tick');
}, 1000 / 60);
compo.start();
