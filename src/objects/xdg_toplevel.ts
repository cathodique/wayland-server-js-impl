import { WlObject } from "./wl_object.js";

const name = 'xdg_toplevel';
export class XdgToplevel extends WlObject {
  appId?: string;

  get iface() { return name }

  setAppId(args: { appId: string }) {
    this.appId = args.appId;
  }
}
