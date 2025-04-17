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
    type: "int" | "uint" | "fixed" | "array" | "string";
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
declare const interfaces: Record<string, WlInterface>;
export { interfaces };
