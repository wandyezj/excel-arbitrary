// eslint-disable-next-line
export function unpackOperands(operands: any[][][]): unknown[] {
    const values = operands.map((value) => {
        if (typeof value === "object") {
            // unwrap single objects [[x]]
            if (Array.isArray(value)) {
                if (value.length === 1) {
                    const firstColumn = value[0];
                    if (Array.isArray(firstColumn)) {
                        if (firstColumn.length === 1) {
                            const single = firstColumn[0];
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