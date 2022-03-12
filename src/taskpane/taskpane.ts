
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

export async function example() {
    await Excel.run(async (context) => {
      /**
       * Insert your Excel code here
       */
      const workbook = context.workbook;
      
      let range = workbook.getSelectedRange();
      let  worksheet = range.worksheet;

      range.load(["columnCount", "rowCount"]);

      await context.sync();

      if (range.columnCount !== 1 && range.rowCount !== 1) {
        worksheet = workbook.worksheets.getActiveWorksheet();
        range = worksheet.getRange("A2");
      }
      // fill to highlight the range changed
      range.format.fill.color = "yellow";

      const testFormula = `=CONTOSO.JS(C1, "(a) => a * a")`;
      range.formulas =[[testFormula]];

      worksheet.getRange("C1").values = [[5]];
      await context.sync();

    });
}
