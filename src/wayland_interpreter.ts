import parse, { Node } from "xml-parser";
import fsp, { readdir } from "node:fs/promises";
import { join } from "node:path";
import { snakeToCamel } from "./utils.js";

const definitionsRoot = join(import.meta.dirname, '../definitions/');

const files = await Promise.all(
  (await readdir(definitionsRoot))
    .map(async (v) => parse(
      await fsp.readFile(
        join(definitionsRoot, v),
        'utf8',
      )
    )));

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
  index: number;
  args: WlArg[];
}

interface WlArgBasic {
  name: string;
  type: 'int' | 'uint' | 'fixed' | 'array' | 'string';
}
interface WlArgInterface {
  name: string;
  type: 'object' | 'new_id';
  allowNull?: boolean;
  interface: string;
}
interface WlArgEnum {
  name: string;
  type: 'uint';
  enum: string;
}
export type WlArg = WlArgBasic | WlArgInterface | WlArgEnum;

export type WlEnum = Record<string, number>;

const interfaces: Record<string, WlInterface> = {};

function childrenToArgs(children: Node[]): WlArg[] {
  return children.map((child) => {
    const type = child.attributes.type as 'int' | 'uint' | 'fixed' | 'array' | 'string' | 'object' | 'new_id';
    const result: any = {
      name: snakeToCamel(child.attributes.name),
      type: type,
    };
    if (type === 'uint' && child.attributes.enum) result.enum = child.attributes.enum;
    if (type === 'object' || type === 'new_id') {
      result.interface = child.attributes.interface;
      result.allowNull = child.attributes['allow-null'] || false;
    }
    return result;
  });
}

for (const parsed of parsedArr) {
  for (const iface of parsed.root.children) {
    if (iface.name !== 'interface') continue;
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
      args: childrenToArgs(v.children.filter((v) => v.name === 'arg')),
    }));
    const events = byTag.event.map((v, i) => ({
      name: snakeToCamel(v.attributes.name),
      index: i,
      args: childrenToArgs(v.children.filter((v) => v.name === 'arg')),
    }));
  
    const currIface = {
      name: iface.attributes.name,
      requests,
      requestsReverse: Object.fromEntries(requests.map((v) => [v.name, v])),
      events,
      eventsReverse: Object.fromEntries(events.map((v) => [v.name, v])),
      enums: Object.fromEntries(byTag.enum
        .map((v) => [snakeToCamel(v.attributes.name), Object.fromEntries(
          v.children
            .filter((v) => v.name === 'entry')
            .map((v_) => [v_.attributes.name, Number(v_.attributes.value)])
        )])),
      version: +iface.attributes.version,
    };
  
    interfaces[currIface.name] = currIface;
  }
}

// console.log(interfaces);

export { interfaces };
