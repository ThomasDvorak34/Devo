// deno-lint-ignore-file no-empty-interface
// The AST divides all the values given by the lexer. It is like a tree.
export type NodeType = 
    // statements
    | "Program" 
    | "VariableDeclaration"
    // expressions
    | "NumericLiteral" 
    | "Identifier" 
    | "BinaryExpression" 
    | "CallExpression"
    | "UnaryExpression" 
    | "FunctionDeclaration";

// a statement is not an expression



export interface Statement {
    kind: NodeType;
}

export interface Program extends Statement {
    kind: "Program";
    body: Statement[];
}

// for store unset x;
export interface VariableDeclaration extends Statement {
    kind: "VariableDeclaration";
    isConst: boolean;
    isArray: boolean;
    isUnset: boolean;
    identifier: string;
    value?: Expression;
}

export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression";
    left: Expression;
    right: Expression;
    operator: string;
    // for everything like (3 + 2) or (foo - bar) * (foo / bar)
}

export interface Identifier extends Expression {
    kind: "Identifier";
    symbol: string;
    // for variables or function calls like foo() - bar() or actualValue - discount
    // or x = 3 + here()
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral";
    value: number;
}