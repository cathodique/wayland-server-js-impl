"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interfaces = void 0;
const xml_parser_1 = __importDefault(require("xml-parser"));
// import fsp, { readdir } from "node:fs/promises";
const node_path_1 = require("node:path");
const utils_js_1 = require("./utils.js");
const node_fs_1 = require("node:fs");
const definitionsRoot = (0, node_path_1.join)(__dirname, "../definitions/");
const files = (0, node_fs_1.readdirSync)(definitionsRoot).map((v) => (0, xml_parser_1.default)((0, node_fs_1.readFileSync)((0, node_path_1.join)(definitionsRoot, v), "utf8")));
const parsedArr = files;
const interfaces = {};
exports.interfaces = interfaces;
function childrenToArgs(children) {
    return children.map((child) => {
        const type = child.attributes.type;
        const result = {
            name: (0, utils_js_1.snakeToCamel)(child.attributes.name),
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
function nodesToEnums(children) {
    const result = {
        itoa: {},
        atoi: {},
    };
    for (const node of children) {
        if (node.name !== 'entry')
            continue;
        const a = node.attributes.name;
        const i = Number(node.attributes.value);
        result.atoi[a] = i;
        result.itoa[i] = a;
    }
    return result;
}
for (const parsed of parsedArr) {
    for (const iface of parsed.root.children) {
        if (iface.name !== "interface")
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
            name: (0, utils_js_1.snakeToCamel)(v.attributes.name),
            index: i,
            since: v.attributes.since == undefined ? undefined : Number(v.attributes.since),
            deprec: v.attributes['deprecated-since'] == undefined ? undefined : Number(v.attributes['deprecated-since']),
            args: childrenToArgs(v.children.filter((v) => v.name === "arg")),
        }));
        const events = byTag.event.map((v, i) => ({
            name: (0, utils_js_1.snakeToCamel)(v.attributes.name),
            index: i,
            since: v.attributes.since == undefined ? undefined : Number(v.attributes.since),
            deprec: v.attributes['deprecated-since'] == undefined ? undefined : Number(v.attributes['deprecated-since']),
            args: childrenToArgs(v.children.filter((v) => v.name === "arg")),
        }));
        const currIface = {
            name: iface.attributes.name,
            requests,
            requestsReverse: Object.fromEntries(requests.map((v) => [v.name, v])),
            events,
            eventsReverse: Object.fromEntries(events.map((v) => [v.name, v])),
            enums: Object.fromEntries(byTag.enum.map((v) => [
                (0, utils_js_1.snakeToCamel)(v.attributes.name),
                nodesToEnums(v.children),
            ])),
            version: +iface.attributes.version,
        };
        interfaces[currIface.name] = currIface;
    }
}
