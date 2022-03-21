
/* eslint-disable */
//import { compileTypeScriptCode } from "./compileTypeScriptCode";

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
function runJavaScript(code: string, operands: any[][][]) {
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

    // if (outputText) {
    //     const result = runJavaScript(outputText, operands);
    //     return result;
    // }

    //return "ERROR: Unknown Compilation Issue";
}

/**
 * Execute JavaScript (code, ...values)
 * @customfunction
 * @param code a javascript lambda to execute
 * @param operands A number (such as 1 or 3.1415), a cell address (such as A1 or $E$11), or a range of cell addresses (such as B3:F12)
 * @returns result of the code
 */
export function JS(code: string, operands: any[][][]): string {
    return runJavaScript(code, operands);
}


/**
 * Execute code (code, ...values)
 * @customfunction
 * @param code a piece of code prefixed with a comment tag to indicate the executor
 * @param operands A number (such as 1 or 3.1415), a cell address (such as A1 or $E$11), or a range of cell addresses (such as B3:F12)
 * @returns result of the code
 */
export async function run(code: string, operands: any[][][]): Promise<string> {
    // unpack operands
    try {
        if (code.startsWith("#python\n")) {
            return "PYTHON NOT IMPLEMENTED";
        } else if (code.startsWith("//javascript\n")) {
            return runJavaScript(code, operands);
        } else if (code.startsWith("//typescript\n")) {
            return await runTypeScript(code, operands);
        }
    
        return "Not Implemented";
    } catch (e) {
        return "ERROR: Uncaught"
    }

}
