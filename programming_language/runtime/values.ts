export type ValueType = "null" | "number" | "boolean";

export interface RuntimeValue {
    type: ValueType;
}

export interface NullValue extends RuntimeValue {
    type: "null";
    value: null;
}

export function MAKE_NULL() {
    return { type: "null", value: null } as NullValue;
}

export interface BooleanValue extends RuntimeValue {
    type: "boolean";
    value: boolean;
}

export function MAKE_BOOLEAN(b = true) {
    return { type: "boolean", value: b } as BooleanValue;
} 

export interface NumberValue extends RuntimeValue {
    type: "number";
    value: number;
}

export function MAKE_NUMBER(n = 0) {
    return { type: "number", value: n } as NumberValue;
}
