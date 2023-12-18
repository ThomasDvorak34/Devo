// ! Change this to not use Deno

import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MAKE_BOOLEAN, MAKE_NULL, MAKE_NUMBER } from "./runtime/values.ts";

main();

function main() {
    const parser = new Parser();
    const environment = new Environment();
    environment.declareVariable("x", MAKE_NUMBER(100));
    environment.declareVariable("true", MAKE_BOOLEAN(true));
    environment.declareVariable("false", MAKE_BOOLEAN(false));
    environment.declareVariable("null", MAKE_NULL());
    console.log("\nDevo v0.1")
    while (true) {
        const input = prompt(">>> ");
        // check for no user input or exit
        if (!input || input.includes("exit")) {
            Deno.exit(1);
        }

        const program = parser.produceAST(input);
        const result = evaluate(program, environment);
        console.log(result);
    }
}