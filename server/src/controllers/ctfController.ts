import { Models } from "../models/Models";
import withTransaction from "../functions/withTransaction";
import jwt from "jsonwebtoken";

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

export const getAccessToken = async (
    accessToken: string
): Promise<any> => {
    return withTransaction(async (client) => {
        const result = await client.query(
            "SELECT * FROM accesstokens WHERE accesstoken = $1",
            [accessToken]
        );
        return result.rows[0] || null;
    });
}

export const createAccessToken = async (): Promise<any> => {
    const randomToken = Math.random().toString(36).substring(2, 15);
    const accessToken = jwt.sign(
        { data: randomToken },
        process.env.ACCESS_TOKEN_SECRET!
    );
    return withTransaction(async (client) => {
        const result = await client.query(
            "INSERT INTO accesstokens (accesstoken) VALUES ($1) RETURNING *",
            [accessToken]
        );
        return result.rows[0] || null;
    });
}

