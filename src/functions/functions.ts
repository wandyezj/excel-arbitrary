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
    return "ts no";
}

/**
 * Execute JavaScript (code, ...values)
 * @customfunction
 * @param code a javascript lambda to execute
 * @param operands A number (such as 1 or 3.1415), a cell address (such as A1 or $E$11), or a range of cell addresses (such as B3:F12)
 * @returns result of the code
 */
// eslint-disable-next-line
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
// eslint-disable-next-line
export async function run(code: string, operands: any[][][]): Promise<string> {
    // unpack operands
    if (code.startsWith("#python\n")) {
        return "PYTHON NOT IMPLEMENTED";
    } else if (code.startsWith("//javascript\n")) {
        return runJavaScript(code, operands);
    } else if (code.startsWith("//typescript\n")) {
        return await runTypeScript(code, operands);
    }

    return "Not Implemented";
}

// hmm can't put the operands first? and then have a different parameter? TypeScript does this fine...

// /**
//  * Execute JavaScript (...values, code)
//  * @customfunction
//  * @param operands A number (such as 1 or 3.1415), a cell address (such as A1 or $E$11), or a range of cell addresses (such as B3:F12), with the final being the JavaScript Lambda code string
//  * @returns result of the code
//  */
//  export function JSAlt(operands: any[][][]): string {
//   // unpack operands
//   const values = unpackOperands(operands);

//   // code is last operand
//   let code  = values.pop();
//   if (typeof code !== "string") {
//     return "code must be the last value";
//   }

//   const result = runCode(code, values);
//   return result;
// }
