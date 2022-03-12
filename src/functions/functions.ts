/* global clearInterval, console, CustomFunctions, setInterval */

// =CONTOSO.JS("()=> 5")
// =CONTOSO.JS("(a)=> a", A1)

function unpackOperands(operands: any[][][]) {
  const values = operands.map((value) => {
    if (typeof value === "object") {
      // unwrap single objects [[x]]
      if (Array.isArray(value)) {
        if (value.length === 1) {
          const first_col = value[0]
          if (Array.isArray(first_col)) {
            if (first_col.length === 1) {
              const single = first_col[0];
              return single;
            }
          }

        }
      }
    }

    // anything that is not a single value make undefined
    return undefined;
  });

  return values;
}

function runCode(code: string, values:(any[]|string|number)[]) {
  const lambda = eval(code)
  const result = lambda(...values);
  return result;
}

/**
 * Execute JavaScript (code, ...values)
 * @customfunction
 * @param code a javascript lambda to execute
 *  @param operands A number (such as 1 or 3.1415), a cell address (such as A1 or $E$11), or a range of cell addresses (such as B3:F12)
 * @returns result of the code
 */
 export function JS(code: string, operands: any[][][]): string {
  // unpack operands
  const values = unpackOperands(operands);
  const result = runCode(code, values);
  return result;
}


// hmm can't put the operands first? and then have a different parameter? TypeScript does this fine...

// /**
//  * Execute JavaScript (...values, code)
//  * @customfunction
//  * @param operands A number (such as 1 or 3.1415), a cell address (such as A1 or $E$11), or a range of cell addresses (such as B3:F12), with the final being the JavaScript Lambda code string
//  * @returns result of the code
//  */
//  export function JSAlt(operands: any[][][]): string {
//   // unpack operands
//   const values = unpackOperands(operands);

//   // code is last operand
//   let code  = values.pop();
//   if (typeof code !== "string") {
//     return "code must be the last value";
//   }

//   const result = runCode(code, values);
//   return result;
// }
