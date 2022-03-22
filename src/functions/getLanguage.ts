export enum Language {
    Python,
    JavaScript,
    TypeScript,
    Unknown,
}

export function getLanguage(code: string): Language {
    if (code.startsWith("#python\n")) {
        return Language.Python;
    }

    if (code.startsWith("//javascript\n")) {
        return Language.JavaScript;
    }

    if (code.startsWith("//typescript\n")) {
        return Language.TypeScript;
    }

    return Language.Unknown;
}
