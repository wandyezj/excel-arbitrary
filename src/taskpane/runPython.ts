interface Pyodide {
    runPython: (code: string) => string;
    globals: {
        set: (key: string, value: string | number | unknown) => void;
    };
}

declare function loadPyodide(options: { indexURL: string }): Pyodide;

let p: Pyodide | undefined = undefined;
async function getPyodide(): Promise<Pyodide> {
    if (p === undefined) {
        // const response = await fetch(
        //     "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/pyodide.js"
        // );
        // const code = await response.text();
        // eval(code);
        p = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/",
        });
    }

    return p;
}

export async function runPython(code: string, args: unknown[] = []) {
    const pyodide = await getPyodide();

    // Pyodide is now ready to use...

    // assign all values to global args
    pyodide.globals.set("args", args);
    const result = pyodide.runPython(code);

    return result;
}
