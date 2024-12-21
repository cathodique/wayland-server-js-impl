import parse from "xml-parser";
import fsp, { readdir } from "node:fs/promises";
import { join } from "node:path";
import { snakeToCamel } from "./utils.js";
const definitionsRoot = join(import.meta.dirname, '../definitions/');
const files = await Promise.all((await readdir(definitionsRoot))
    .map(async (v) => parse(await fsp.readFile(join(definitionsRoot, v), 'utf8'))));
const parsedArr = files;
const interfaces = {};
function childrenToArgs(children) {
    return children.map((child) => {
        const type = child.attributes.type;
        const result = {
            name: snakeToCamel(child.attributes.name),
            type: type,
        };
        if (type === 'uint' && child.attributes.enum)
            result.enum = child.attributes.enum;
        if (type === 'object' || type === 'new_id') {
            result.interface = child.attributes.interface;
            result.allowNull = child.attributes['allow-null'] || false;
        }
        return result;
    });
}
for (const parsed of parsedArr) {
    for (const iface of parsed.root.children) {
        if (iface.name !== 'interface')
            continue;
        const byTag = {
            request: [],
            event: [],
            enum: [],
        };
        for (const child of iface.children) {
            if (child.name in byTag)
                byTag[child.name].push(child);
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
                .map((v) => [snakeToCamel(v.attributes.name), Object.fromEntries(v.children
                    .filter((v) => v.name === 'entry')
                    .map((v_) => [v_.attributes.name, Number(v_.attributes.value)]))])),
            version: +iface.attributes.version,
        };
        interfaces[currIface.name] = currIface;
    }
}
// console.log(interfaces);
export { interfaces };
