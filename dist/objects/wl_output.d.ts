import { Connection } from "../connection.js";
import { ExistentParent, BaseObject } from "./base_object.js";
import { EventClient, EventServer } from "../lib/event_clientserver.js";
import { SpecificRegistry } from "../lib/specific_registry.js";
import { WlSurface } from "./wl_surface.js";
type OutputServerToClient = {
    'update': [];
    'enter': [WlSurface];
};
export type OutputEventServer = EventServer<OutputServerToClient, {}>;
export type OutputEventClient = EventClient<{}, OutputServerToClient>;
export declare class OutputRegistry extends SpecificRegistry<OutputConfiguration, OutputEventServer> {
    get iface(): "wl_output";
    current: OutputConfiguration;
    constructor(v: OutputConfiguration[], current?: OutputConfiguration);
}
export interface OutputConfiguration {
    x: number;
    y: number;
    w: number;
    h: number;
    effectiveW: number;
    effectiveH: number;
}
export declare class WlOutput extends BaseObject {
    get iface(): "wl_output";
    info: OutputConfiguration;
    recipient: OutputEventClient;
    constructor(conx: Connection, oid: number, parent: ExistentParent, args: Record<string, any>);
    advertise(): void;
    release(): void;
}
export {};
