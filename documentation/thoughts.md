# thoughts

perhaps a better name is excel-code, since it uses code in excel, and provides code functions

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


hmm.. code is already taken us will instead use RUN.JS with the RUN.{language or code}

would be cool to have single run function instead, that way it is a bit easier to deal with.

hmm better to simply signify language with something that is part of the cell text that way an editor can pick up on it.



can pass things in with an args variable.


TypeScript?

What if you could run a cell in the editor to try things out and get error information or console log statements?

## notes
https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing

npm run start:web -- --document "url"

## Improvements

- explanation of tooling
- why does dev-server fail all the time?
- how to clear cache on web?
- custom function stick around can't replace?
- should wait for server to start before launching the application