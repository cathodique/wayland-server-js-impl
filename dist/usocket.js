"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UServer = exports.USocket = void 0;
// @ts-ignore
const usocket_1 = __importDefault(require("usocket"));
exports.USocket = usocket_1.default.USocket;
exports.UServer = usocket_1.default.UServer;
// TODO: Turn into @types package
