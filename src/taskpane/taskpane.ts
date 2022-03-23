/* eslint-disable */

let codeArea: HTMLTextAreaElement | undefined = undefined;
// address is not tracked
let cellAddress: string | undefined = undefined;

import { example } from "./example";
import { runJavaScript } from "./runJavaScript";
import { runPython } from "./runPython";
import { runTypeScript } from "./runTypeScript";

type runCode = (code: string, args?: unknown[]) => Promise<unknown>;

declare interface window {
    sharedState?: {
        value: string;
        runPython: runCode;
        runJavaScript: runCode;
        runTypeScript: runCode;
    }
}

// The initialize function must be run each time a new page is loaded
Office.onReady(() => {
    const mapping: [string, () => Promise<void>][] = [
        ["button_example", example],
        ["button_edit", edit],
        ["button_save", save],
        ["button_run", run],
    ];

    mapping.forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
            element.onclick = value;
        }
    });

    codeArea = document.getElementById("code") as HTMLTextAreaElement;

    // initial shared state
    window["sharedState"] = {value: "empty", runPython, runJavaScript, runTypeScript};
});

function setEditorText({ text, cell }) {
    console.log(`set: ${cell} ${text}`);
    if (codeArea) {
        codeArea.value = text;
    }

    cellAddress = cell;
}

function getEditorText() {
    const text = codeArea?.value || "";
    const cell = cellAddress;
    console.log(`get: ${cell} ${text}`);
    return { text, cell };
}

/**
 *
 */
export async function save(): Promise<void> {
    await Excel.run(async (context) => {
        const workbook = context.workbook;
        const range = workbook.getSelectedRange();
        range.load(["formulas", "address"]);
        await context.sync();
        const formulas = range.formulas;
        const address = range.address;

        if (formulas.length === 1 && formulas[0].length === 1) {
            const { text, cell } = getEditorText();
            range.formulas = [[text]];

            if (cell !== address) {
                console.log(`addresses are not the same ${cell} != ${address}`);
            }
        } else {
            console.log("selected more than a cell");
        }
    });
}

export async function edit(): Promise<void> {
    await Excel.run(async (context) => {
        const workbook = context.workbook;
        const range = workbook.getSelectedRange();
        range.load(["formulas", "address"]);
        await context.sync();
        const formulas = range.formulas;
        const address = range.address;

        if (formulas.length === 1 && formulas[0].length === 1) {
            const text = formulas[0][0];
            const cell = address;
            setEditorText({ text, cell });
        } else {
            console.log("selected more than a cell");
        }
    });
}

export async function run(): Promise<void> {
    //const code = getEditorText();
    // run appropriate version

    let result = await runPython(`
import sys
sys.version
    `);
    console.log(result);

    result = await runPython(
        `
[a,b, *other] = args
a + b
    `,
        [5, 5, 5, 5]
    );
    console.log(result);
}
