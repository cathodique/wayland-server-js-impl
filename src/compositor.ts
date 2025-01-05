import { rmSync } from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { console } from "./logger.js";
import { Connection, parseOnReadable } from "./connection.js";
import { UServer, USocket } from "@cathodique/usocket";
import EventEmitter from "node:events";
import { ExistentParent } from "./objects/base_object.js";
import { newIdMap } from "./new_id_map.js";
import { WlRegistry, WlRegistryMetadata } from "./objects/wl_registry.js";
import { createId } from "@paralleldrive/cuid2";

type CompositorEvents = {
  tick: [],
  connection: [Connection],
};

export type ObjectMetadata = {
  wl_registry: WlRegistryMetadata;
};

export interface CompositorArgs {
  // replacements?: {
  //   [k in keyof typeof newIdMap]: {
  //     new(comp: Connection, oid: number, parent: ExistentParent, args: Record<string, any>): InstanceType<(typeof newIdMap)[k]>
  //     | { onConstructor(v: InstanceType<(typeof newIdMap)[k]>): void };
  //   };
  // };
  metadata: ObjectMetadata;
}

export class Compositor extends EventEmitter<CompositorEvents> {
  server: UServer;
  closed: boolean = true;
  socketPath?: string;
  socketLockfile?: string;
  currConnId = 0;

  metadata: ObjectMetadata;

  constructor(args: CompositorArgs) {
    super();

    this.metadata = args.metadata;

    // Create a server
    this.server = new UServer();
    this.server.on(
      "connection",
      function (this: Compositor, socket: USocket) {
        // Comment one:

        console.log("New Connection!!!");

        // - As compositor
        this.emit('connection', new Connection(this.currConnId++, this, socket, false));

        // - As MITM
        // const socket2 = new USocket({});
        // const conx = new Connection(this.currConnId++, this, socket, true);
        // socket2.connect({ path: "/run/user/1000/wayland-0" }, () => {
        //   socket.on("readable", () => {
        //     parseOnReadable(socket, ({ data, fds }) => {
        //       // console.log("C2S", data && data.toString("hex"), fds);
        //       try {
        //         const [[a, b, c]] = [...conx.parser(data)];
        //         console.log("C2S", Connection.prettyWlObj(a), b, Connection.prettyArgs(c));
        //         socket2.write({ data, fds });
        //       } catch (e) {
        //         console.log('C2S got error', e);
        //         socket2.write({ data, fds });
        //       }
        //     });
        //   });
        //   socket2.on("readable", () => {
        //     parseOnReadable(socket2, ({ data, fds }) => {
        //       // console.log("S2C", data && data.toString("hex"), fds);
        //       try {
        //         const [[a, b, c]] = [...conx.parser(data, true)];
        //         console.log("S2C", Connection.prettyWlObj(a), b, Connection.prettyArgs(c));
        //         if (b === 'global' && !WlRegistry.supportedByRegistry.includes(c.interface)) return console.log('Ignoring');
        //         // if (!WlRegistry.registry.includes(c.))
        //         socket.write({ data, fds });
        //       } catch (e) {
        //         console.log('S2C got error', e);
        //         socket.write({ data, fds });
        //       }
        //     });
        //   });
        // });
      }.bind(this),
    );

    for (const event of ["exit", "SIGINT", "SIGTERM"] as const) {
      process.on(
        event,
        function (this: Compositor) {
          console.log(event);
          this.close();
          process.exit();
        }.bind(this),
      );
    }
  }

  close() {
    if (this.closed) return;
    if (this.socketPath) rmSync(this.socketPath);
    if (this.socketLockfile) rmSync(this.socketLockfile);
    this.closed = true;
  }

  start() {
    if (!this.closed) return;
    this.closed = false;
    return new Promise<void>(
      async function (this: Compositor, r: () => void) {
        const runtimeDir = process.env.XDG_RUNTIME_DIR;
        if (!runtimeDir)
          throw new Error("XDG_RUNGIME_DIR is not set; panicking");

        const waylandServersMax = Math.max(
          ...(await fsp.readdir(runtimeDir))
            .filter((v) => v.match(/^wayland-\d+$/))
            .map((v) => +v.match(/\d+$/)![0]),
          0,
        );

        // Define the socket path
        this.socketPath = path.join(
          runtimeDir,
          `wayland-${waylandServersMax + 1}`,
        );
        this.socketLockfile = `${this.socketPath}.lock`;

        // Listen on the socket path
        this.server.listen(
          this.socketPath,
          async function (this: Compositor) {
            const fileHandle = await fsp.open(this.socketLockfile!, "a");
            fileHandle.close();

            console.log(`Server listening on ${this.socketPath}`);
          }.bind(this),
        );
      }.bind(this),
    );
  }
}
