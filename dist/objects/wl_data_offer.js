"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlDataOffer = void 0;
const utils_js_1 = require("../utils.js");
const base_object_js_1 = require("./base_object.js");
const name = 'wl_data_offer';
class WlDataOffer extends base_object_js_1.BaseObject {
    get iface() { return name; }
    constructor(conx, oid, parent, args) {
        if (!args[utils_js_1.fromServer])
            throw new Error("Data offer may only be instantiated by the server");
        super(conx, oid, parent, args);
        this.addCommand('offer', { mimeType: args.mimeType });
    }
}
exports.WlDataOffer = WlDataOffer;
