function addTestRange(
    worksheet: Excel.Worksheet,
    n: number,
    {
        description,
        formula,
        code,
        value,
    }: {
        description: string;
        formula?: string;
        code: string;
        value?: string | number;
    }
) {
    const descriptionValue = description.trim();
    // if run is not registered than does not write
    const formulaValue = formula || `=RUN($C$${n}, D${n})`;
    const valueValue = value || 5;
    worksheet.getRange(`A${n}:D${n}`).values = [
        // eslint-disable-next-line
        [descriptionValue, formulaValue, code, valueValue],
    ];
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
            // eslint-disable-next-line
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
            // eslint-disable-next-line
            formula: `=JS(C${n}, D${n})`,
            code: `(a) => a * a`,
        });

        // run javascript
        n++;
        addTestRange(worksheet, n, {
            description: `run - JavaScript - basic`,
            code: `//javascript
(a) => a * a
`,
        });

        // TypeScript - basic
        n++;
        addTestRange(worksheet, n, {
            description: `run - TypeScript - basic`,
            code: `//typescript
(a) => a * a
`,
        });

        // python - basic
        n++;
        addTestRange(worksheet, n, {
            description: `
run - Python - basic
Use special local args
to pass in values`,
            code: `#python
[a, *other] = args
a * a`,
        });
    });
}
