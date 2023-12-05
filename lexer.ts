// ! Need to fix so that a source is taken in from somewhere else
// ! Should not use Deno and console.log()
// ! Put errors somewhere else and find another way to exit the script

// ! Using regular expressions can significantly speed up the process

export enum TokenType {
    // types
    Number,
    String,
    Boolean, 
    Mixed,
    Void,
    // other
    Identifier,
    As, // same thing as =
    BinaryOperator,
    OpenParentheses,
    CloseParentheses,
    OpenBrace,
    CloseBrace,
    OpenBracket,
    CloseBracket,
    // keywords
    Store,
    Array, 
    Unset,
    Const,
    Local,
    ClassOnly,
    Function,
    Define,
    Class,
    If,
    ElseIf,
    Else,
    While,
    For,
    Terminate,
    // new line
    newline,
}

const KEYWORDS: Record<string, TokenType> = {
    "store": TokenType.Store,
    "as": TokenType.As,
    "unset": TokenType.Unset,
    "const": TokenType.Const,
    "local": TokenType.Local,
    "class-only": TokenType.ClassOnly,
    "function": TokenType.Function,
    "array": TokenType.Array,
    "define": TokenType.Define,
    "class": TokenType.Class,
    "if": TokenType.If,
    "else if": TokenType.ElseIf,
    "else": TokenType.Else,
    "while": TokenType.While,
    "for": TokenType.For,
    "terminate": TokenType.Terminate,
};

export interface Token {
    value: string,
    type: TokenType,
}

function token(value = "", type: TokenType): Token {
    return { value, type };
}

function isAlphabetic(src: string) {
    // checks to see if it is an alphabetic character
    return src.toUpperCase() != src.toLowerCase();
}

function isNumber(src: string) {
    const char = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return (char >= bounds[0] && char <= bounds[1]);
    // sees if it is a numeric characters
}

function isSkippable(str: string) {
    // TODO: Fix this later
    // saves space by ignoring some things like \n or " "
    return str == ' ' || str == '\n' || str == '\t';
}

export function tokenize(sourceCode: string): Token[] {
    // loops through every character in the source code and returns a list of tokens 
    const tokens = new Array<Token>();
    const src = sourceCode.split("");
    // * .split() <== this bleeds memory
    // * find a faster way of doing this
    while (src.length > 0) {
        if (src[0] == '(') {
            tokens.push(token(src.shift(), TokenType.OpenParentheses));
        } else if (src[0] == ';') {
            tokens.push(token(src.shift(), TokenType.newline));
        } else if (src[0] == ')') {
            tokens.push(token(src.shift(), TokenType.CloseParentheses));
        } else if (src[0] == '{') {
            tokens.push(token(src.shift(), TokenType.OpenBrace));
        } else if (src[0] == '}') {
            tokens.push(token(src.shift(), TokenType.CloseBrace));
        } else if (src[0] == '[') {
            tokens.push(token(src.shift(), TokenType.OpenBracket));
        } else if (src[0] == ']') {
            tokens.push(token(src.shift(), TokenType.CloseBracket));
        } else if (src[0] == "+" || src[0] == "-" || src[0] == '*' || src[0] == "/") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
            // * above for all the SINGLE-CHARACTER tokens
            // * below for all the MULTI-CHARACTER tokens
        } else {
            if (isNumber(src[0])) {
                // going to build a number
                let number = "";
                while (src.length > 0 && isNumber(src[0])) {
                    number += src.shift();
                }
                tokens.push(token(number, TokenType.Number))
            } else if (isAlphabetic(src[0])) {
                // builds an identifier
                // however, need to check to see if the user-built identifier
                // is a reserved keyword or not
                let identifier = "";
                while (src.length > 0 && isAlphabetic(src[0])) {
                    identifier += src.shift();
                }
                // check to see if any of the words are keywords
                const reserved = KEYWORDS[identifier];
                if (reserved == undefined) {
                    tokens.push(token(identifier, TokenType.Identifier));
                } else {
                    tokens.push(token(identifier, reserved));
                }
            } else if (isSkippable(src[0])) {
                src.shift();
            } else {
                console.log("Unrecognized character found in source: ",src[0]);
                Deno.exit(1);
            }
        }

    }
    return tokens;
}

// * test

const source = await Deno.readTextFile("./test.devo");
for (const token of tokenize(source)) {
    console.log(token);
}