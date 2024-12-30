import { Duplex, EventEmitter } from "node:stream";
export interface USocket extends Duplex {
    write(args: number[]): boolean;
    write(args: Buffer): boolean;
    write(args: {
        data: Buffer;
        fds: number[];
    }): boolean;
    read(length: number | undefined): boolean;
    read(length: number | null, count: number | null): {
        data: Buffer | null;
        fds: number[];
    };
    connect(path: string, callback?: () => void): void;
}
type USocketEvents = {
    connection: [USocket];
};
export interface UServer extends EventEmitter<USocketEvents> {
    listen: (addr: string, cb: () => void) => void;
}
export declare const USocket: {
    new (): USocket;
};
export declare const UServer: {
    new (): UServer;
};
export {};
