/* global console, document, Excel, Office */

let codeArea: HTMLTextAreaElement = undefined;
// address is not tracked
let cellAddress: string = undefined;

// The initialize function must be run each time a new page is loaded
Office.onReady(() => {
    document.getElementById("button_example").onclick = example;
    document.getElementById("button_edit").onclick = edit;
    document.getElementById("button_save").onclick = save;

    codeArea = document.getElementById("code") as HTMLTextAreaElement;
});

function setEditorText({ text, cell }) {
    console.log(`set: ${cell} ${text}`);
    codeArea.value = text;
    cellAddress = cell;
}

function getEditorText() {
    const text = codeArea.value;
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

/**
 * Inject example showing off the formula
 */
export async function example(): Promise<void> {
    await Excel.run(async (context) => {
        const workbook = context.workbook;
        const worksheet = workbook.worksheets.getActiveWorksheet();

        // eslint-disable-next-line
        const formula = `=JS(B2,C2)`;
        const code = `(a) => a * a`;
        const value = 5;

        worksheet.getRange("A1:C1").values = [["formula", "code", "value"]];
        worksheet.getRange("A2:C2").formulas = [[formula, code, value]];
    });
}
