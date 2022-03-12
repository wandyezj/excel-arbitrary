
/* global console, document, Excel, Office */

let codeArea: HTMLTextAreaElement = undefined;

// The initialize function must be run each time a new page is loaded
Office.onReady(() => {
  document.getElementById("button_example").onclick = example;
  document.getElementById("button_edit").onclick = edit;
  document.getElementById("button_save").onclick = () => {};

  codeArea = document.getElementById("code") as HTMLTextAreaElement;
});

function setEditorText(text) {
  codeArea.innerText = text;
}

/**
 * 
 */
export async function edit() {
  try {
    await Excel.run((async (context) => {
      const workbook = context.workbook
      const range = workbook.getSelectedRange();
      range.load("formulas");
      await context.sync();
      const formulas = range.formulas

      if (formulas.length === 1 && formulas[0].length === 1) {
        const formula = formulas[0][0]
        setEditorText(formula);
      }


    }))
  }catch (error) {
    console.error(JSON.stringify(error));
  }
  
}

/**
 * Inject example showing off the formula
 */
export async function example() {
    await Excel.run(async (context) => {

      const workbook = context.workbook;
      const worksheet = workbook.worksheets.getActiveWorksheet();

      const formula = `=CONTOSO.JS(B2,C2)`
      const value = 5;
      const code = `(a) => a * a`;
      
      worksheet.getRange("A1:C1").values = [["formula", "code", "value"]];
      worksheet.getRange("A2:C2").formulas = [[formula, code, value]];

    });
}
