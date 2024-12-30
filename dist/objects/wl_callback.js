"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlCallback = void 0;
const base_object_js_1 = require("./base_object.js");
const name = 'wl_callback';
class WlCallback extends base_object_js_1.WlObject {
    get iface() { return name; }
    done(callbackData) {
        this.connection.addCommand(this, 'done', { callback_data: callbackData });
        this.connection.objects.delete(this.oid);
    }
}
exports.WlCallback = WlCallback;
