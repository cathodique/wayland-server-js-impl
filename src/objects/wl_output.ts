import { OutputConfiguration } from "../compositor.js";
import { Connection } from "../connection.js";
import { interfaces } from "../wayland_interpreter.js";
import { ExistentParent, WlObject } from "./base_object.js";

const name = 'wl_output' as const;
export class WlOutput extends WlObject<ExistentParent> {
  get iface() { return name }

  outputConfig: OutputConfiguration;

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);

    const extraData = this.connection.registry!.getExtraData(args.name);
    if (extraData?.expectedIface !== this.iface) throw new Error();

    this.outputConfig = {
      x: extraData.x,
      y: extraData.y,
      w: extraData.w,
      h: extraData.h,
    };

    // TODO: FIX THIS MESS
    this.addCommand('geometry', {
      x: this.outputConfig.x,
      y: this.outputConfig.y,
      physical_width: this.outputConfig.w / 3.8,
      physical_height: this.outputConfig.h / 3.8,
      subpixel: interfaces.wl_output.enums.subpixel.atoi.horizontal_rgb,
      make: 'IDK',
      model: 'IDK As if I knew',
      transform: interfaces.wl_output.enums.transform.atoi.normal,
    });
    this.addCommand('mode', {
      mode: 3, // idc i just wann move on
      width: this.outputConfig.w,
      height: this.outputConfig.h,
      refresh: 60, // again idrc for now
    });
    this.addCommand('scale', { factor: 1 });
  }
}
