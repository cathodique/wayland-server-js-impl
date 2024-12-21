import { Connection } from "../connection.js";

export class WlObject {
  connection: Connection;
  oid: number;

  constructor(conx: Connection, oid: number, args: Record<string, any>) {
    this.oid = oid;
    this.connection = conx;
  }
  get iface(): string { throw new Error('wl_object alone does not have a name') }

  destroy() {
    this.connection.objects.delete(this.oid);
  }
}
