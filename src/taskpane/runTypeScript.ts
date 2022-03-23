import { compileTypeScriptCode } from "./compileTypeScriptCode";
import { runJavaScript } from "./runJavaScript";

export async function runTypeScript(code: string, args: unknown[] = []): Promise<unknown> {
    const {outputText, compileErrorMessage } = await compileTypeScriptCode(code);
    if (compileErrorMessage) {
        return compileErrorMessage;
    }

    if (outputText === undefined) {
        return "ERROR: Unknown Compilation Issue";
    }

    const result = runJavaScript(outputText, args);
    return result;

}
