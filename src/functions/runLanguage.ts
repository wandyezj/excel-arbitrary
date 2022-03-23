//import { compileTypeScriptCode } from "../taskpane/compileTypeScriptCode";

import { unpackOperands } from "./unpackOperands";

export async function runLanguage(
    code: string,
    operands: any[][][]
): Promise<string> {
    // unpack operands
    try {
        const language = getLanguage(code);

        switch (language) {
            case Language.JavaScript:
                return runJavaScript(code, operands);
            case Language.TypeScript:
                return runTypeScript(code, operands);
            case Language.Python:
                return runPython(code, operands);
            default:
                return "Language Not Identified";
        }
    } catch (e) {
        return `ERROR: Uncaught`;
    }
}

enum Language {
    Python,
    JavaScript,
    TypeScript,
    Unknown,
}

function getLanguage(code: string): Language {
    if (code.startsWith("#python\n")) {
        return Language.Python;
    }

    if (code.startsWith("//javascript\n")) {
        return Language.JavaScript;
    }

    if (code.startsWith("//typescript\n")) {
        return Language.TypeScript;
    }

    return Language.Unknown;
}

interface window {
    sharedState?: {
        value: string;
        runPython: (code: string, args?: any[]) => Promise<unknown>;
        runJavaScript: (code: string, args?: any[]) => Promise<unknown>;
        runTypeScript: (code: string, args?: any[]) => Promise<unknown>;
    };
}

async function runArbitrary(runner: string, code: string, operands: any[][][]) {
    const sharedState = window ? window["sharedState"] : undefined;
    const run = sharedState ? sharedState[runner] : undefined;

    if (run) {
        const values = unpackOperands(operands);
        return run(code, values);
    }
    return `${runner} NOT Implemented`;
}

async function runPython(code: string, operands: any[][][]) {
    return runArbitrary("runPython", code, operands);
}

async function runJavaScript(code: string, operands: any[][][]) {
    return runArbitrary("runJavaScript", code, operands);
}

async function runTypeScript(code: string, operands: any[][][]) {
    return runArbitrary("runTypeScript", code, operands);
}
