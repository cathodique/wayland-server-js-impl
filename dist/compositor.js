import { rmSync } from "node:fs";
import fsp from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { console } from "./logger.js";
import { Connection } from "./connection.js";
export class Compositor {
    server;
    closed = true;
    socketPath;
    socketLockfile;
    currConnId = 0;
    constructor() {
        // Create a server
        this.server = net.createServer((function (socket) {
            // Comment one:
            // - As compositor
            new Connection(this.currConnId++, this, socket);
            console.log('New Connection!!!');
            // - As MITM
            // const socket2 = new net.Socket();
            // new Connection(this.currConnId ++, this, socket, socket2);
            // socket2.on('data', (v) => { console.log('S2C', v.toString('hex')); socket.write(v); });
            // socket.on('data', (v) => { console.log('C2S', v.toString('hex')); socket2.write(v); });
            // socket2.connect('/run/user/1000/wayland-0');
        }).bind(this));
        for (const event of ['exit', 'SIGINT', 'SIGTERM']) {
            process.on(event, (function () {
                this.close();
                process.exit();
            }).bind(this));
        }
    }
    close() {
        if (this.closed)
            return;
        if (this.socketPath)
            rmSync(this.socketPath);
        if (this.socketLockfile)
            rmSync(this.socketLockfile);
        this.closed = true;
    }
    start() {
        if (!this.closed)
            return;
        this.closed = false;
        return new Promise((async function (r) {
            const runtimeDir = process.env.XDG_RUNTIME_DIR;
            if (!runtimeDir)
                throw new Error('XDG_RUNGIME_DIR is not set; panicking');
            const waylandServersMax = Math.max(...(await fsp.readdir(runtimeDir))
                .filter((v) => v.match(/^wayland-\d+$/))
                .map((v) => +v.match(/\d+$/)[0]), 0);
            // Define the socket path
            this.socketPath = path.join(runtimeDir, `wayland-${waylandServersMax + 1}`);
            this.socketLockfile = `${this.socketPath}.lock`;
            // Listen on the socket path
            this.server.listen(this.socketPath, (async function () {
                const fileHandle = await fsp.open(this.socketLockfile, 'a');
                fileHandle.close();
                console.log(`Server listening on ${this.socketPath}`);
            }).bind(this));
        }).bind(this));
    }
}
