import { WlObject } from "./wl_object.js";
export var InstructionType;
(function (InstructionType) {
    InstructionType[InstructionType["Add"] = 0] = "Add";
    InstructionType[InstructionType["Subtract"] = 1] = "Subtract";
})(InstructionType || (InstructionType = {}));
export class RegRectangle {
    type;
    x;
    y;
    w;
    h;
    constructor(type, y, x, h, w) {
        this.type = type;
        this.y = y;
        this.x = x;
        this.h = h;
        this.w = w;
    }
    hasCoordinate(y, x) {
        return this.x >= x && this.y >= y
            && x < this.w + this.x && y < this.h + this.y;
    }
}
const name = 'wl_region';
export class WlRegion extends WlObject {
    get iface() { return name; }
    instructions = [];
    add(args) {
        this.instructions.push(new RegRectangle(InstructionType.Add, args.y, args.x, args.h, args.w));
    }
    subtract(args) {
        this.instructions.push(new RegRectangle(InstructionType.Subtract, args.y, args.x, args.h, args.w));
    }
}
