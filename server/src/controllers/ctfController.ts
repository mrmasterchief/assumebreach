import { Models } from "../models/Models";
import withTransaction from "../functions/withTransaction";

export const addFlagAndScoreToUser = async (
    userId: string,
    unsafeId: string,
    flag: string,
    score: number
): Promise<Models["UserDetails"] | null> => {
    if (!userId && !unsafeId) {
        throw new Error("Either userId or unsafeId must be provided.");
    }
    const column = userId ? "user_id" : "unsafe_id";
    const value = userId || unsafeId;

    return withTransaction(async (client) => {
        const result = await client.query(
            `UPDATE user_details SET collected_flags = array_append(collected_flags, $1), score = score + $2 WHERE ${column} = $3 RETURNING *`,
            [flag, score, value]
        );
        return result.rows[0] || null;
    });
}
