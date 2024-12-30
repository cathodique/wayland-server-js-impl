import { Connection } from "./connection.js";
import { UServer } from "@cathodique/usocket";
import EventEmitter from "node:events";
type CompositorEvents = {
    tick: [];
    connection: [Connection];
    newMon: [OutputConfiguration];
    delMon: [OutputConfiguration];
};
export interface OutputConfiguration {
    x: number;
    y: number;
    w: number;
    h: number;
}
export declare class Compositor extends EventEmitter<CompositorEvents> {
    server: UServer;
    closed: boolean;
    socketPath?: string;
    socketLockfile?: string;
    currConnId: number;
    outputConfigurations: OutputConfiguration[];
    constructor(outputConfigurations: OutputConfiguration[]);
    close(): void;
    start(): Promise<void> | undefined;
}
export {};
