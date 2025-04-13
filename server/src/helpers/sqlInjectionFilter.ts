import { simulateSQLInjection } from "../functions/simulateSqlInjection";
import { sqlInjectionStatements } from "../data/sqlInjectionStatements";
import { errors } from "../data/errors";
import { containsKeywords, getFlagBySecureCodeID } from "./getFlags";

const FROM_KEYWORD = "FROM";
const FROM_USERS_KEYWORD = "FROM users";


export async function sqlInjectionFilter(email: string, password: string) {
    try {
        const inputs = [email, password].map((input) => input.toUpperCase());

        if (containsKeywords(inputs.join(" "), sqlInjectionStatements.disallowedSQLInjectionStatements)) {
            throw new Error(errors[403.2]);
        }

        if (containsKeywords(inputs.join(" "), sqlInjectionStatements.allowedSQLInjectionStatements)) {
            const containsFrom = inputs.some((input) => input.includes(FROM_KEYWORD));
            const containsFromUsers = inputs.some((input) => input.includes(FROM_USERS_KEYWORD));

            if (containsFrom && !containsFromUsers) {
                throw new Error(errors[403.2]);
            }

            const user = await simulateSQLInjection(email, password);
            const flag = getFlagBySecureCodeID(4);

            if (user.length > 0) {
                return { user, flag };
            }

            throw new Error(errors[403.2]);
        }

        return null;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An unexpected error occurred");
        }
        throw new Error("An unexpected error occurred");
    }
}
