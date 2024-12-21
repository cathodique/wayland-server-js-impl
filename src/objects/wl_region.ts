import { WlObject } from "./wl_object.js";

export enum InstructionType {
  Add,
  Subtract,
}
export class RegRectangle {
  type: InstructionType;
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(type: InstructionType, y: number, x: number, h: number, w: number) {
    this.type = type;
    this.y = y;
    this.x = x;
    this.h = h;
    this.w = w;
  }

  hasCoordinate(y: number, x: number) {
    return this.x >= x && this.y >= y
      && x < this.w + this.x && y < this.h + this.y;
  }
}

const name = 'wl_region';
export class WlRegion extends WlObject {
  get iface() { return name }

  instructions: RegRectangle[] = [];

  add(args: Record<string, any>) {
    this.instructions.push(new RegRectangle(InstructionType.Add, args.y, args.x, args.h, args.w));
  }
  
  subtract(args: Record<string, any>) {
    this.instructions.push(new RegRectangle(InstructionType.Subtract, args.y, args.x, args.h, args.w));
  }
}
