import { RuntimeValue, NumberValue, MAKE_NULL } from './values.ts';
import { BinaryExpression, Identifier, NumericLiteral, Program, Statement } from '../frontend/ast.ts';
import Environment from './environment.ts';

function evaluateProgram(program: Program, environment: Environment): RuntimeValue {
    let lastEvaluated: RuntimeValue = MAKE_NULL();
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, environment);
    }
    return lastEvaluated;
}

function evaluateNumericBinaryExpression(left: NumberValue, right: NumberValue, operator: string): NumberValue {
    let result: number;
    if (operator == "+") {
        result = left.value + right.value;
    } else if (operator == "-") {
        result = left.value - right.value;
    } else if (operator == "*") {
        result = left.value * right.value;
    } else if (operator == "/") {
        // TODO: add divide by zero checks
        result = left.value / right.value;
    } else {
        result = left.value % right.value;
    }
    return { value: result, type: "number"};
}

function evaluateBinaryExpression(binaryOperation: BinaryExpression, environment: Environment): RuntimeValue {
    const leftSide = evaluate(binaryOperation.left, environment);
    const rightSide = evaluate(binaryOperation.right, environment);
    if (leftSide.type == "number" && rightSide.type == "number") {
        return evaluateNumericBinaryExpression(leftSide as NumberValue, rightSide as NumberValue, binaryOperation.operator);
    }
    return MAKE_NULL();
}

function evaluateIdentifier(identifier: Identifier, environment: Environment): RuntimeValue {
    const value = environment.lookupVariable(identifier.symbol);
    return value;
}

export function evaluate(astNode: Statement, environment: Environment): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return { value: ((astNode as NumericLiteral).value), type: "number" } as NumberValue;
        case "Identifier":
            return evaluateIdentifier(astNode as Identifier, environment);
        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression, environment);
        case "Program":
            return evaluateProgram(astNode as Program, environment);
        default:
            console.error("This AST Node has not yet been setup for interpretation", astNode);
            Deno.exit(0);
    }
}