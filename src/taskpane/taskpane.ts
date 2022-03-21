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
        //worksheet.getRange(`A${n}:D${n}`).values = [["description", "formula", "code", "value"]];

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

//         // eslint-disable-next-line
//         const description = `
// js
// Use a specific run function
// can take in arbitrary number of values`.trim();
//         const formula = `=JS(C${n}, D${n})`;
//         const code = `
// (a) => a * a`;
//         const value = 5;
//         worksheet.getRange(`A${n}:D${n}`).formulas = [[description, formula, code, value]];

        // run javascript
        n++;
        addTestRange(worksheet, n, {
            description: `run - javascript`, 
            code: `//javascript
(a) => a * a
`
        });

//         const descriptionJavaScript = `
// run - javascript
// `.trim();
//         const formulaJavaScript = `=RUN(C${n}, D${n})`;
//         const codeJavaScript = `//javascript
// (a) => a * a
// `;
//         const valueJavaScript = 5;
//         worksheet.getRange(`A${n}:D${n}`).formulas = [[descriptionJavaScript,formulaJavaScript, codeJavaScript, valueJavaScript]];

        // run typescript
        n++;
        addTestRange(worksheet, n, {
            description: `run - typescript`, 
            code: `//typescript
(a) => a * a
`
        });

//         const descriptionTypeScript = `
// run - javascript
// `.trim();
//         const formulaTypeScript = `=RUN(C${n}, D${n})`;
//         const codeTypeScript = `//javascript
// (a) => a * a
// `;
//         const valueTypeScript = 5;
//         worksheet.getRange(`A${n}:D${n}`).formulas = [[descriptionTypeScript,formulaTypeScript, codeTypeScript, valueTypeScript]];



        // run python
        n++;
        addTestRange(worksheet, n, {
            description: `
run - python
Use special local args
to pass in values`, 
            code: `#python
[a] = args
a * a`
        });

//         const descriptionPython = `
// run - python
// Use special local args
// to pass in values`.trim();
//         const formulaPython = `=RUN(C${n}, D${n})`;
//         const codePython = `#python
// [a] = args
// a * a`;
//         const valuePython = 5;
//         worksheet.getRange(`A${n}:D${n}`).formulas = [[descriptionPython, formulaPython, codePython, valuePython]];


    });
}
