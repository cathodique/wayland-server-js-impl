import { Connection } from "./connection.js";
import { UServer } from "@cathodique/usocket";
import EventEmitter from "node:events";
import { WlRegistryMetadata } from "./objects/wl_registry.js";
type CompositorEvents = {
    tick: [];
    connection: [Connection];
};
export type ObjectMetadata = {
    wl_registry: WlRegistryMetadata;
};
export interface CompositorArgs {
    metadata: ObjectMetadata;
}
export declare class Compositor extends EventEmitter<CompositorEvents> {
    server: UServer;
    closed: boolean;
    socketPath?: string;
    socketLockfile?: string;
    currConnId: number;
    metadata: ObjectMetadata;
    constructor(args: CompositorArgs);
    close(): void;
    start(): Promise<void> | undefined;
}
export {};
