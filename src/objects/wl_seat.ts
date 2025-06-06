import { Connection } from "../connection.js";
import { EventClient, EventServer } from "../lib/event_clientserver.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { SpecificRegistry } from "../lib/specific_registry";
import { WlSurface } from "./wl_surface.js";

export interface SeatConfiguration {
  name: string;
  capabilities: number;
}

const name = 'wl_seat' as const;

type SeatServerToClient = {
  'enter': [WlSurface, number, number];
  'moveTo': [number, number];
  'leave': [WlSurface];
  'buttonDown': [number];
  'buttonUp': [number];
  'focus': [WlSurface];
  'blur': [WlSurface];
};
export type SeatEventServer = EventServer<SeatServerToClient, {}>;
export type SeatEventClient = EventClient<{}, SeatServerToClient>;
export class SeatRegistry extends SpecificRegistry<SeatConfiguration, SeatEventServer> {
  get iface() { return name }
}

export class WlSeat extends BaseObject {
  get iface() { return name }

  info: SeatConfiguration;
  seatRegistry: SeatRegistry;

  constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>) {
    super(conx, oid, parent, args);

    this.seatRegistry = this.connection.registry!.seatRegistry;
    this.info = this.seatRegistry.map.get(args.name)!;

    this.addCommand('name', { name: this.info.name });
    this.addCommand('capabilities', { capabilities: this.info.capabilities });
  }
}
