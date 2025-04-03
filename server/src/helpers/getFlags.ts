import { flags } from "../data/flags";

export function containsKeywords(input: string, keywords: string[]): boolean {
    return keywords.some((keyword) => input.toUpperCase().includes(keyword));
}

export function getFlagBySecureCodeID(secureCodeID: number): string | undefined {
    return flags.find((flag) => flag.secureCodeID === secureCodeID)?.flag;
}