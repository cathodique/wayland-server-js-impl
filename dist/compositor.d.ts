import net from "node:net";
export declare class Compositor {
    server: net.Server;
    closed: boolean;
    socketPath?: string;
    socketLockfile?: string;
    currConnId: number;
    constructor();
    close(): void;
    start(): Promise<void> | undefined;
}
