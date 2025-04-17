"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compositor = void 0;
const node_fs_1 = require("node:fs");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const logger_js_1 = require("./logger.js");
const connection_js_1 = require("./connection.js");
const usocket_1 = require("@cathodique/usocket");
const node_events_1 = __importDefault(require("node:events"));
// import { ExistentParent } from "./objects/base_object.js";
// import { newIdMap } from "./new_id_map.js";
const wl_registry_js_1 = require("./objects/wl_registry.js");
const blacklist = ['wl_keyboard'];
class Compositor extends node_events_1.default {
    server;
    closed = true;
    socketPath;
    socketLockfile;
    currConnId = 0;
    metadata;
    constructor(args) {
        super();
        this.metadata = args.metadata;
        // Create a server
        this.server = new usocket_1.UServer();
        this.server.on("connection", function (socket) {
            // Comment one:
            logger_js_1.console.log("New Connection!!!");
            // - As compositor
            // this.emit('connection', new Connection(this.currConnId++, this, socket, false));
            // - As MITM
            const socket2 = new usocket_1.USocket({});
            const conx = new connection_js_1.Connection(this.currConnId++, this, socket, true);
            socket2.connect({ path: "/run/user/1000/wayland-0" }, () => {
                socket.on("readable", () => {
                    (0, connection_js_1.parseOnReadable)(socket, ({ data, fds }) => {
                        // console.log("C2S", data && data.toString("hex"), fds);
                        try {
                            const [[a, b, c]] = [...conx.parser(data)];
                            if (!blacklist.includes(a.iface)) {
                                logger_js_1.console.log("C2S", connection_js_1.Connection.prettyWlObj(a), b, JSON.stringify(connection_js_1.Connection.prettyArgs(c)));
                            }
                            socket2.write({ data, fds });
                        }
                        catch (e) {
                            logger_js_1.console.log('C2S got error', e);
                            socket2.write({ data, fds });
                        }
                    });
                });
                socket2.on("readable", () => {
                    (0, connection_js_1.parseOnReadable)(socket2, ({ data, fds }) => {
                        // console.log("S2C", data && data.toString("hex"), fds);
                        try {
                            const [[a, b, c]] = [...conx.parser(data, true)];
                            if (!blacklist.includes(a.iface)) {
                                logger_js_1.console.log("S2C", connection_js_1.Connection.prettyWlObj(a), b, JSON.stringify(connection_js_1.Connection.prettyArgs(c)));
                            }
                            if (b === 'global' && !wl_registry_js_1.WlRegistry.supportedByRegistry.includes(c.interface))
                                return logger_js_1.console.log('Ignoring');
                            // if (!WlRegistry.registry.includes(c.))
                            socket.write({ data, fds });
                        }
                        catch (e) {
                            logger_js_1.console.log('S2C got error', e);
                            socket.write({ data, fds });
                        }
                    });
                });
            });
        }.bind(this));
        for (const event of ["exit", "SIGINT", "SIGTERM"]) {
            process.on(event, function () {
                logger_js_1.console.log(event);
                this.close();
                process.exit();
            }.bind(this));
        }
    }
    close() {
        if (this.closed)
            return;
        if (this.socketPath)
            (0, node_fs_1.rmSync)(this.socketPath);
        if (this.socketLockfile)
            (0, node_fs_1.rmSync)(this.socketLockfile);
        this.closed = true;
    }
    start() {
        if (!this.closed)
            return;
        this.closed = false;
        return new Promise(async function (r) {
            const runtimeDir = process.env.XDG_RUNTIME_DIR;
            if (!runtimeDir)
                throw new Error("XDG_RUNGIME_DIR is not set; panicking");
            const waylandServersMax = Math.max(...(await promises_1.default.readdir(runtimeDir))
                .filter((v) => v.match(/^wayland-\d+$/))
                .map((v) => +v.match(/\d+$/)[0]), 0);
            // Define the socket path
            this.socketPath = node_path_1.default.join(runtimeDir, `wayland-${waylandServersMax + 1}`);
            this.socketLockfile = `${this.socketPath}.lock`;
            // Listen on the socket path
            this.server.listen(this.socketPath, async function () {
                const fileHandle = await promises_1.default.open(this.socketLockfile, "a");
                fileHandle.close();
                logger_js_1.console.log(`Server listening on ${this.socketPath}`);
            }.bind(this));
        }.bind(this));
    }
}
exports.Compositor = Compositor;
