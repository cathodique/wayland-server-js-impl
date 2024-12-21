export class WlObject {
    connection;
    oid;
    constructor(conx, oid, args) {
        this.oid = oid;
        this.connection = conx;
    }
    get iface() { throw new Error('wl_object alone does not have a name'); }
    destroy() {
        this.connection.objects.delete(this.oid);
    }
}
