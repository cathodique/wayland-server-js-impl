"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifaceVersion = exports.fromServer = void 0;
exports.snakeToCamel = snakeToCamel;
exports.snakePrepend = snakePrepend;
function snakeToCamel(str) {
    return str.replace(/_[a-z]?/g, (v) => v.slice(1).toUpperCase());
}
function snakePrepend(str1, str2) {
    return `${str1}${str2[0].toUpperCase()}${str2.slice(1)}`;
}
exports.fromServer = Symbol('fromServer');
exports.ifaceVersion = Symbol('ifaceVersion');
