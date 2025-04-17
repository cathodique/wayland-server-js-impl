import { EventEmitter } from "node:events";
import { Connection } from "../connection.js";
import { WlDisplay } from "./wl_display.js";
import { ifaceVersion } from "../utils.js";

export type Parent = BaseObject<Record<string, any[]>, Parent> | null;
export type ExistentParent = BaseObject<Record<string, any[]>, Parent>;
export type DefaultEventMap = Record<string, any[]>;
export class BaseObject<T extends Record<string, any[]> = DefaultEventMap, U extends Parent = ExistentParent> extends EventEmitter<T> {
  connection: Connection;
  oid: number;
  _version?: number;

  parent: U;

  constructor(conx: Connection, oid: number, parent: U, args: Record<string, any>) {
    super();
    this.oid = oid;
    this.connection = conx;
    this.parent = parent;
    if (ifaceVersion in args) this._version = args[ifaceVersion] as number;
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

  get version(): number {
    if (this._version != null) return this._version;
    if (this.parent) return this.parent.version;
    throw new Error('You ask too much of an orphan...');
  }
}
