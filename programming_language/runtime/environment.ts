import { RuntimeValue } from "./values.ts";

// if it's global, then we need to do somthing with those environments

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeValue>; 

    constructor(parentEnvironment?: Environment) {
        this.parent = parentEnvironment;
        this.variables = new Map();
    }

    public declareVariable(variableName: string, value: RuntimeValue): RuntimeValue {
        if (this.variables.has(variableName)) {
            throw `Cannot declare variable ${variableName}. It is already defined.`;
        }

        this.variables.set(variableName, value);
        return value;
    }

    public assignVariable(variableName: string, value: RuntimeValue): RuntimeValue {
        const environment = this.resolve(variableName);
        environment.variables.set(variableName, value);
        return value;
    }

    public lookupVariable(variableName: string): RuntimeValue {
        const environment = this.resolve(variableName);
        return environment.variables.get(variableName) as RuntimeValue;
    }

    public resolve(variableName: string): Environment {
        if (this.variables.has(variableName)) {
            return this;
        }

        if (this.parent == undefined) {
            throw `Cannot resolve ${variableName} as it does not exist.`; 
        }

        return this.parent.resolve(variableName);
    }
}