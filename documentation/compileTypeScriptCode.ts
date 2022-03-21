// //import ts from "typescript";
// /**
//  * required typescript compiler to be loaded
//  * @param code the code to compile
//  */
// export async function compileTypeScriptCode(
//     code: string
// ): Promise<{ compileErrorMessage?: string; outputText?: string }> {
//     const ts = await import("typescript");
//     const result = ts.transpileModule(code, {
//         reportDiagnostics: true,
//         compilerOptions: {
//             target: ts.ScriptTarget.ES5,
//             allowJs: true,
//             lib: ["dom", "es2015"],
//         },
//     });

//     if (result.diagnostics?.length) {
//         const compileErrorMessage = result.diagnostics
//             ?.map((item) => {
//                 const upThroughError = code.substring(0, item.start);
//                 const afterError = code.substring(item.start + 1);
//                 const lineNumber = upThroughError.split("\n").length;
//                 const startIndexOfThisLine = upThroughError.lastIndexOf("\n");
//                 const lineText = code
//                     .substring(
//                         startIndexOfThisLine,
//                         item.start + Math.max(afterError.indexOf("\n"), 0)
//                     )
//                     .trim();
//                 const message = `${item.messageText}\n ${lineText}`;
//                 return syntaxErrorLine(lineNumber, message);
//             })
//             .join("\n\n");

//         return {
//             compileErrorMessage,
//         };
//     }

//     // Manually remove es2015 module generation
//     const outputText = result.outputText.replace(
//         'Object.defineProperty(exports, "__esModule", { value: true });',
//         ""
//     );

//     return {
//         outputText,
//     };
// }

// function syntaxErrorLine(lineNumber: number, message: string): string {
//     return `Line #${lineNumber}: ${message}`;
// }
