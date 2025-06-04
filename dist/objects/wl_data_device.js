"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WlDataDevice = void 0;
const base_object_js_1 = require("./base_object.js");
const name = 'wl_data_device';
class WlDataDevice extends base_object_js_1.BaseObject {
    seat;
    recipient;
    constructor(conx, oid, parent, args) {
        super(conx, oid, parent, args);
        this.seat = args.seat;
        this.recipient = this.seat.seatRegistry.transports.get(conx).get(this.seat.info).createRecipient();
        this.recipient.on('focus', function () {
            const newOid = this.connection.createServerOid();
            this.addCommand('dataOffer', { id: { oid: newOid } });
            // const offer = this.connection.createObject('wl_data_offer', newOid, this, { mimeType: 'text/plain;charset=utf-8', [fromServer]: true });
            this.addCommand('selection', { id: null });
        }.bind(this));
    }
    get iface() { return name; }
}
exports.WlDataDevice = WlDataDevice;
