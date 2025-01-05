import { EventEmitter } from "node:stream";
import { Connection } from "../connection.js";
import { interfaces } from "../wayland_interpreter.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { EventClient, EventServer } from "../lib/event_clientserver.js";
import { SpecificRegistry } from "./wl_registry.js";

const name = 'wl_output' as const;

type OutputServerToClient = { 'update': [] };
export type OutputEventServer = EventServer<OutputServerToClient, {}>;
export type OutputEventClient = EventClient<{}, OutputServerToClient>;
export class OutputRegistry extends SpecificRegistry<OutputConfiguration, OutputEventServer> {
  get iface() { return name }
}

export interface OutputConfiguration {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class WlOutput extends BaseObject {
  get iface() { return name }

  info: OutputConfiguration;
  recipient: OutputEventClient;

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);

    const outputReg = this.connection.registry!.outputRegistry;
    this.info = outputReg.map.get(args.name)!;

    this.recipient = outputReg.transports.get(this.info)!.createRecipient();

    this.advertise();
    this.recipient.on('update', this.advertise.bind(this));
  }

  advertise() {
    // TODO: FIX THIS MESS
    this.addCommand('geometry', {
      x: this.info.x,
      y: this.info.y,
      physicalWidth: this.info.w / 3.8,
      physicalHeight: this.info.h / 3.8,
      subpixel: interfaces.wl_output.enums.subpixel.atoi.horizontal_rgb,
      make: 'IDK',
      model: 'IDK As if I knew',
      transform: interfaces.wl_output.enums.transform.atoi.normal,
    });
    this.addCommand('mode', {
      mode: 3, // idc i just wann move on
      width: this.info.w,
      height: this.info.h,
      refresh: 60, // again idrc for now
    });
    this.addCommand('scale', { factor: 1 });
  }

  release() { this.recipient.destroy(); }
}
