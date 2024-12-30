import { Connection } from "../connection.js";

export type Parent = WlObject<Parent> | null;
export type ExistentParent = WlObject<Parent>;
export class WlObject<T extends Parent> {
  connection: Connection;
  oid: number;

  parent: T;

  constructor(conx: Connection, oid: number, parent: T, args: Record<string, any>) {
    this.oid = oid;
    this.connection = conx;
    this.parent = parent;
  }
  get iface(): string { throw new Error('wl_object alone does not have a name') }

  wlDestroy() {
    this.connection.destroy(this);
  }

  toString() {
    return `[wlObject ${this.iface}]`;
  }

  addCommand(eventName: string, args: Record<string, any>) {
    this.connection.addCommand(this, eventName, args);
  }
}
