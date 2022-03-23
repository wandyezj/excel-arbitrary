//import { compileTypeScriptCode } from "../taskpane/compileTypeScriptCode";


export async function runLanguage(code: string, operands: any[][][]): Promise<string> {
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


// eslint-disable-next-line
function unpackOperands(operands: any[][][]): unknown[] {
    const values = operands.map((value) => {
        if (typeof value === "object") {
            // unwrap single objects [[x]]
            if (Array.isArray(value)) {
                if (value.length === 1) {
                    const firstColumn = value[0];
                    if (Array.isArray(firstColumn)) {
                        if (firstColumn.length === 1) {
                            const single = firstColumn[0];
                            return single;
                        }
                    }
                }
            }
        }

        // anything that is not a single value make undefined
        return undefined;
    });

    return values;
}

// eslint-disable-next-line
function runCode(code: string, values: (any[] | string | number | unknown)[]) {
    const lambda = eval(code);
    const result = lambda(...values);
    return result;
}

// eslint-disable-next-line
export function runJavaScript(code: string, operands: any[][][]) {
    // unpack operands
    const values = unpackOperands(operands);
    const result = runCode(code, values);
    return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function runTypeScript(code: string, operands: any[][][]) {
    return "TypeScript Not Implemented";
    // const {outputText, compileErrorMessage } = await compileTypeScriptCode(code);
    // if (compileErrorMessage) {
    //     return compileErrorMessage;
    // }

    // if (outputText === undefined) {
    //     return "ERROR: Unknown Compilation Issue";
    // }

    // const result = runJavaScript(outputText, operands);
    // return result;

}

async function runPython(code: string, operands: any[][][]) {
    return "Python NOT Implemented";
}