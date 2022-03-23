
// eslint-disable-next-line
export function runJavaScript(code: string, values: unknown[] = []) {
    const lambda = eval(code);
    const result = lambda(...values);
    return result;
}
