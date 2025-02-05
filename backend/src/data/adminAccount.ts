import { findUserByEmail } from "../controllers/auth";
import { createUser } from "../controllers/auth";
import { RBAC } from "../middleware/rbac";

export default async function createAdminAccount() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set");
    }

    const existingUser = await findUserByEmail(email);
    if(existingUser) return;

    if (!existingUser) {
        createUser(email, password, 'admin', RBAC.ADMIN);
    }
}


