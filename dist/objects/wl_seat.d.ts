import { Connection } from "../connection.js";
import { EventClient, EventServer } from "../lib/event_clientserver.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { SpecificRegistry } from "./wl_registry.js";
export interface SeatConfiguration {
    name: string;
    capabilities: number;
}
type SeatServerToClient = {
    'enter': [number, number, number];
    'moveTo': [number, number];
    'leave': [number, number, number];
    'buttonDown': [number];
    'buttonUp': [number];
};
export type SeatEventServer = EventServer<SeatServerToClient, {}>;
export type SeatEventClient = EventClient<{}, SeatServerToClient>;
export declare class SeatRegistry extends SpecificRegistry<SeatConfiguration, SeatEventServer> {
    get iface(): "wl_seat";
}
export declare class WlSeat extends BaseObject {
    get iface(): "wl_seat";
    info: SeatConfiguration;
    seatRegistry: SeatRegistry;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
}
export {};
