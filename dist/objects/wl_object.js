export class WlObject {
    connection;
    oid;
    parent;
    constructor(conx, oid, parent, args) {
        this.oid = oid;
        this.connection = conx;
        this.parent = parent;
    }
    get iface() { throw new Error('wl_object alone does not have a name'); }
    wlDestroy() {
        this.connection.objects.delete(this.oid);
    }
    toString() {
        return `[wlObject ${this.iface}]`;
    }
}
