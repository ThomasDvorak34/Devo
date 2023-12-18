// deno-lint-ignore-file no-explicit-any
// ! change Deno.exit() to something else...

import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier } from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];

    private notEndOfFile(): boolean {
        return this.tokens[0].type != TokenType.EndOfFile;
    }

    private at() {
        return this.tokens[0] as Token;
    }

    private next() {
        return this.tokens[1] as Token;
    }

    private eat() {
        // eats the current token
        return this.tokens.shift() as Token;
    }

    private eatNext() {
        return this.tokens.splice(1, 1);
    }

    private expect(type: TokenType, err: any) {
        const previous = this.tokens.shift() as Token;
        if (!previous || previous.type != type) {
            console.error("Parser Error: \n", err, previous, "Expecting: ", type);
            Deno.exit(1);
        }
        return previous;
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        const program: Program = {
            kind: "Program",
            body: [],
        }
        // Continue until we reach the end of the file
        while (this.notEndOfFile()) {
            program.body.push(this.parseStatement());
        }
        return program; 
    }
    // put it down here because the following will take up a lot of space
    private parseStatement(): Statement {
        // skip to parseExpression
        switch (this.at().type) {
            case TokenType.Store:
                // TODO: CHECK FOR UNSET OR ARRAY OR CONST
                return this.parseVariableDeclaration();
            default:
                return this.parseExpression();
        }
    }

    private parseVariableDeclaration(): Statement {
        // now, we are expecting an identifier
        // but we need to check for specifications
        // STORE { ARRAY | UNSET | CONST | IDENTIIER} AS VALUE;
        // ! CONTINUE WORKING ON THIS
        const declarationType = this.eat().type;
        const isConst = this.at().type == TokenType.Const;
        const isUnset = this.at().type == TokenType.Unset;
        const isArray = this.at().type == TokenType.Array;
        const isIdentifier = this.at().type == TokenType.Identifier;
        const isNewLine = this.at().type == TokenType.EndLine;
        if (isConst) {
            // if it's store const
            this.eat();
            const identifier = this.expect(TokenType.Identifier, "Expected identifer name following variable declaraion ('store { storeType }').").value;
        } else if (isUnset) {
            // if it's store unset
            this.eat();
            const identifier = this.expect(TokenType.Identifier, "Expected identifer name following variable declaraion ('store { storeType }').").value;
        } else if (isArray) {
            // if it's store array
            this.eat();
            const identifier = this.expect(TokenType.Identifier, "Expected identifer name following variable declaraion ('store { storeType }').").value;
        } else if (isIdentifier) {
            // if it's an identifier
            const identifier = this.expect(TokenType.Identifier, "Expected identifer name following variable declaraion ('store { storeType }').").value;
        } else if (isNewLine) {
            throw "Must assign value to the expression. No value was provided.";
        } else {
            // then there's something wrong
            console.error("Invalid. Must be an identifier, 'const', 'array', or 'unset': ", declarationType);
        }
    }
    // * an expression is a statement but a statement is not an expression
    private parseExpression(): Expression {
        return this.parseAdditiveExpression();
    }

    private parseAdditiveExpression(): Expression {
        let left = this.parseMultiplicativeExpression();
        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.parseMultiplicativeExpression();
            left = {
                kind: "BinaryExpression",
                left, 
                right, 
                operator,
            } as BinaryExpression;
        }
        return left;
    }

    private parseMultiplicativeExpression(): Expression {
        let left = this.parsePrimaryExpression();
        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.eat().value;
            const right = this.parsePrimaryExpression();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator,
            } as BinaryExpression;
        }
        return left;
    }

    // * Order of precedence
    // * AssignmentExpression
    // * MemberExpression
    // * FunctionCall
    // * LogicalExpression
    // * ComparisonExpression
    // * AdditiveExpression
    // * MultiplicativeExpression
    // * UnaryExpression
    // * PrimaryExpression

    private parsePrimaryExpression(): Expression {
        const token = this.at().type;

        switch (token) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral;
            case TokenType.OpenParentheses: {
                this.eat();
                const value = this.parseExpression();
                this.expect(TokenType.CloseParentheses, "Unexpected token found inside parenthesized expression. Exptected closing parentheses."); // )
                return value;
            }
            default: 
                console.error("Unexpected token found during parsing: ", this.at());
                Deno.exit(1);
        }
    }
}