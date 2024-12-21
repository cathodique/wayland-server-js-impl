import { WlObject } from "./wl_object.js";
export declare enum InstructionType {
    Add = 0,
    Subtract = 1
}
export declare class RegRectangle {
    type: InstructionType;
    x: number;
    y: number;
    w: number;
    h: number;
    constructor(type: InstructionType, y: number, x: number, h: number, w: number);
    hasCoordinate(y: number, x: number): boolean;
}
export declare class WlRegion extends WlObject {
    get iface(): string;
    instructions: RegRectangle[];
    add(args: Record<string, any>): void;
    subtract(args: Record<string, any>): void;
}
