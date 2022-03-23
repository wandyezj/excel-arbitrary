/* eslint-disable */
//import { compileTypeScriptCode } from "./compileTypeScriptCode";

import { runLanguage } from "./runLanguage";
import { runJavaScript } from "../taskpane/runJavaScript";
import { unpackOperands } from "./unpackOperands";

/**
 * Execute JavaScript (code, ...values)
 * @customfunction
 * @param code a javascript lambda to execute
 * @param operands A number (such as 1 or 3.1415), a cell address (such as A1 or $E$11), or a range of cell addresses (such as B3:F12)
 * @returns result of the code
 */
export function JS(code: string, operands: any[][][]): string {
    const args = unpackOperands(operands);
    return runJavaScript(code, args);
}



/**
 * Execute code (code, ...values)
 * @customfunction
 * @param code a piece of code prefixed with a comment tag to indicate the executor
 * @param operands A number (such as 1 or 3.1415), a cell address (such as A1 or $E$11), or a range of cell addresses (such as B3:F12)
 * @returns result of the code
 */
export async function RUN(code: string, operands: any[][][]): Promise<string> {
    return runLanguage(code, operands);
}

/**
 * Execute code (code, ...values)
 * @customfunction
 * @param code a piece of code prefixed with a comment tag to indicate the executor
 * @param operands A number (such as 1 or 3.1415), a cell address (such as A1 or $E$11), or a range of cell addresses (such as B3:F12)
 * @returns result of the code
 */
export async function RUNA(code: string, operands: any[][][]): Promise<string> {
    return runLanguage(code, operands);
}


/**
 * Execute code (code, ...values)
 * @customfunction
 * @param code a piece of code prefixed with a comment tag to indicate the executor
 * @param operands A number (such as 1 or 3.1415), a cell address (such as A1 or $E$11), or a range of cell addresses (such as B3:F12)
 * @returns result of the code
 */
 export async function TEST7(code: string, operands: any[][][]): Promise<string> {
    return runLanguage(code, operands);
}
