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

function addTestRange(worksheet: Excel.Worksheet, n: number, {description, formula, code, value}:{
    description: string,
    formula?: string,
    code: string,
    value?: string | number
}) {
    worksheet.getRange(`A${n}:D${n}`).values = [[description.trim(), formula || `=RUN(C${n}, D${n})`, code, value || 5]];
}

/**
 * Inject example showing off the formula
 */
export async function example(): Promise<void> {
    await Excel.run(async (context) => {
        const workbook = context.workbook;
        const worksheet = workbook.worksheets.getActiveWorksheet();

        let n = 0;

        // headers
        n++;
        addTestRange(worksheet, n, {
            description: "description", 
            formula: "formula",
            code: "code",
            value: "value",
        });

        // js
        n++;
        addTestRange(worksheet, n, {
            description: `
js
Use a specific run function
can take in arbitrary number of values`, 
            formula: `=JS(C${n}, D${n})`,
            code: `(a) => a * a`,
        });


        // run javascript
        n++;
        addTestRange(worksheet, n, {
            description: `run - JavaScript - basic`, 
            code: `//javascript
(a) => a * a
`
        });

        // TypeScript - basic
        n++;
        addTestRange(worksheet, n, {
            description: `run - TypeScript - basic`, 
            code: `//typescript
(a) => a * a
`
        });

        // python - basic
        n++;
        addTestRange(worksheet, n, {
            description: `
run - Python - basic
Use special local args
to pass in values`, 
            code: `#python
[a] = args
a * a`
        });


    });
}
