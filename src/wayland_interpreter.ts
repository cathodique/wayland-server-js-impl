import parse, { Node } from "xml-parser";
// import fsp, { readdir } from "node:fs/promises";
import { join } from "node:path";
import { snakeToCamel } from "./utils.js";
import { readdirSync, readFileSync } from "node:fs";

const definitionsRoot = join(__dirname, "../definitions/");

const files = readdirSync(definitionsRoot).map((v) =>
  parse(readFileSync(join(definitionsRoot, v), "utf8")),
);

const parsedArr = files;

export interface WlInterface {
  name: string;
  version: number;
  requests: WlMessage[];
  requestsReverse: Record<string, WlMessage>;
  events: WlMessage[];
  eventsReverse: Record<string, WlMessage>;
  enums: Record<string, WlEnum>;
}

export interface WlMessage {
  name: string;
  since: number | undefined;
  deprec: number | undefined;
  index: number;
  args: WlArg[];
}

interface WlArgBasic {
  name: string;
  type: "int" | "uint" | "fixed" | "array" | "string" | "fd";
}
interface WlArgInterface {
  name: string;
  type: "object" | "new_id";
  allowNull: boolean;
  interface: string | undefined;
}
interface WlArgEnum {
  name: string;
  type: "uint";
  enum: string;
}
export type WlArg = WlArgBasic | WlArgInterface | WlArgEnum;

export interface WlEnum {
  itoa: Record<number, string>;
  atoi: Record<string, number>;
}

const interfaces: Record<string, WlInterface> = {};

function childrenToArgs(children: Node[]): WlArg[] {
  return children.map((child) => {
    const type = child.attributes.type as
      | "int"
      | "uint"
      | "fixed"
      | "array"
      | "string"
      | "object"
      | "new_id";
    const result: any = {
      name: snakeToCamel(child.attributes.name),
      type: type,
    };
    if (type === "uint" && child.attributes.enum)
      result.enum = child.attributes.enum;
    if (type === "object" || type === "new_id") {
      result.interface = child.attributes.interface;
      result.allowNull = child.attributes["allow-null"] || false;
    }
    return result;
  });
}

function nodesToEnums(children: Node[]) {
  const result = {
    itoa: {} as Record<number, string>,
    atoi: {} as Record<string, number>,
  };

  for (const node of children) {
    if (node.name !== 'entry') continue;
    const a: string = node.attributes.name;
    const i: number = Number(node.attributes.value);

    result.atoi[a] = i;
    result.itoa[i] = a;
  }

  return result;
}

for (const parsed of parsedArr) {
  for (const iface of parsed.root.children) {
    if (iface.name !== "interface") continue;
    const byTag: Record<string, Node[]> = {
      request: [],
      event: [],
      enum: [],
    };

    for (const child of iface.children) {
      if (child.name in byTag) byTag[child.name].push(child);
    }

    const requests = byTag.request.map((v, i) => ({
      name: snakeToCamel(v.attributes.name),
      index: i,
      since: v.attributes.since == undefined ? undefined :  Number(v.attributes.since),
      deprec: v.attributes['deprecated-since'] == undefined ? undefined : Number(v.attributes['deprecated-since']),
      args: childrenToArgs(v.children.filter((v) => v.name === "arg")),
    }));
    const events = byTag.event.map((v, i) => ({
      name: snakeToCamel(v.attributes.name),
      index: i,
      since: v.attributes.since == undefined ? undefined :  Number(v.attributes.since),
      deprec: v.attributes['deprecated-since'] == undefined ? undefined : Number(v.attributes['deprecated-since']),
      args: childrenToArgs(v.children.filter((v) => v.name === "arg")),
    }));

    const currIface: WlInterface = {
      name: iface.attributes.name,
      requests,
      requestsReverse: Object.fromEntries(requests.map((v) => [v.name, v])),
      events,
      eventsReverse: Object.fromEntries(events.map((v) => [v.name, v])),
      enums: Object.fromEntries(
        byTag.enum.map((v) => [
          snakeToCamel(v.attributes.name),
          nodesToEnums(v.children),
        ]),
      ),
      version: +iface.attributes.version,
    };

    interfaces[currIface.name] = currIface;
  }
}

// console.log(interfaces);

export { interfaces };
