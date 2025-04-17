import { Connection } from "../connection.js";
import { fromServer } from "../utils.js";
import { BaseObject, ExistentParent } from "./base_object.js";

const name = 'wl_data_offer' as const;
export class WlDataOffer extends BaseObject {
  get iface() { return name }

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string | symbol, any>) {
    if (!args[fromServer]) throw new Error("Data offer may only be instantiated by the server");
    super(conx, oid, parent, args);

    this.addCommand('offer', { mimeType: args.mimeType });
  }
}
