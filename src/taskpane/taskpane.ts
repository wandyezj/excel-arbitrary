/* eslint-disable */


import { example } from "./example";
import { getLanguage, Language } from "./getLanguage";
import { runJavaScript } from "./runJavaScript";
import { runPython } from "./runPython";
import { runTypeScript } from "./runTypeScript";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';


// address is not tracked
let cellAddress: string | undefined = undefined;


type runCode = (code: string, args?: unknown[]) => Promise<unknown>;

declare interface window {
    sharedState?: {
        value: string;
        runPython: runCode;
        runJavaScript: runCode;
        runTypeScript: runCode;
    };
}

const elements = {
    getElement(id: string) {
        const element = document.getElementById(id);
        if (element === undefined) {
            throw new Error(`undefined ${id}`);
        }
        return element;
    },

    buttonSelectId:"button_select",
    get buttonSelect() {
        return this.getElement(this.buttonSelectId) as HTMLButtonElement;
    },

    textareaCodeLanguageId: "textarea_code_language",
    get textareaCodeLanguage() {
        return this.getElement(this.textareaCodeLanguageId) as HTMLTextAreaElement;
    },

    textareaCodeId: "textarea_code",
    get textareaCode() {
        return this.getElement(this.textareaCodeId) as HTMLTextAreaElement;
    },

    divMonacoId: "div_monaco",
    get divMonaco() {
        return this.getElement(this.divMonacoId) as HTMLDivElement;
    }
}


//#region "editor"

let editor: monaco.editor.IStandaloneCodeEditor | undefined = undefined;
function createMonacoEditor() {
    const div = elements.divMonaco;
    editor = monaco.editor.create(div, {
        value: ``,
        language: 'javascript',
        theme: 'vs'
    });

}

function languageToMonacoLanguage(language: Language) {
    switch (language) {
        case Language.JavaScript:
            return "javascript";
        case Language.TypeScript:
            return "typescript";
        case Language.Python:
            return "python";
        default:
            return "plaintext";
    }
}

function setMonacoEditorText(language: Language, code: string) {
    const newMonacoLanguage = languageToMonacoLanguage(language);
    console.log(newMonacoLanguage);

    if (editor) {
        const model = monaco.editor.createModel(code, newMonacoLanguage);
        editor.setModel(model);
    }
}

function getMonacoEditorText(): string  | undefined{

    return editor?.getModel()?.getValue();

}


function setEditorText({ text, cell }) {
    console.log(`set: ${cell} ${text}`);
    //elements.textareaCode.value = text;
    cellAddress = cell;

    // language
    const language = getLanguage(text)
    elements.textareaCodeLanguage.value = language;

    // Set Up the Monaco Editor
    setMonacoEditorText(language, text);
}

function getEditorText() {
    //const text = elements.textareaCode.value || "";
    const text = getMonacoEditorText() || "";
    const cell = cellAddress;
    console.log(`get: ${cell} ${text}`);
    return { text, cell };
}



createMonacoEditor();

//#endregion "editor"

// The initialize function must be run each time a new page is loaded
Office.onReady(() => {
    const mapping: [string, () => Promise<void>][] = [
        ["button_example", example],
        ["button_edit", edit],
        ["button_save", save],
        ["button_run", run],
        [elements.buttonSelectId, select],
    ];

    mapping.forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
            element.onclick = value;
        }
    });

    // initial shared state
    window["sharedState"] = {
        value: "empty",
        runPython,
        runJavaScript,
        runTypeScript,
    };

    selectSetup();
});

//#region "select"

function selectSetup() {
    // Activate handler and keep it on the whole time
    Excel.run(async (context) => {
        context.workbook.worksheets.onSelectionChanged.add(async (event) => {
            await onSelectionChanged(event.worksheetId, event.address);
        });
    });
}

/**
 * should the selection changed event handler be run?
 * adjust the button text to reflect current state
 */
let selectOn = false;
async function select() {
    // toggle
    selectOn = !selectOn;
    elements.buttonSelect.innerText = `Toggle Select Edit Cell${selectOn ? " (currently:ON)" : ""}`;
}


function onSelectionChanged(worksheetId: string, address: string) {
    console.log(`selectOn: ${selectOn}`);
    if (selectOn) {
        Excel.run(async (context) => {
            const worksheet = context.workbook.worksheets.getItem(worksheetId);
            const range = worksheet.getRange(address);

            range.load(["formulas"]);
            await context.sync();
            const formulas = range.formulas;

            if (formulas.length === 1 && formulas[0].length === 1) {
                const text = formulas[0][0];
                const cell = address;
                setEditorText({text, cell});
            } 
        })
    }
}

//#endregion "select"


/**
 * saved editor content to selected cell
 */
async function save(): Promise<void> {
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

async function edit(): Promise<void> {
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


// for run to work
async function run(): Promise<void> {
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


