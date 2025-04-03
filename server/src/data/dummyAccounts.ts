import { findUserByEmail } from "../controllers/userController";
import { createUser } from "../controllers/userController";
import { RBAC } from "../middleware/rbac";

export  async function createAdminAccount() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set");
    }

    const existingUser = await findUserByEmail(email);
    if(existingUser) return;

    if (!existingUser) {
        createUser(email, password, true, RBAC.ADMIN);
    }
}


export async function createDummyAcccount() {
    const crackPasswordList = [
        "abc123",
        "password",
        "passw0rd",
        "password123",
        "qwerty123",
        "admin",
        "master",
        "letmein",
        "welcome",
        "mustang",
        "dragon",
    ]
    for(let i = 0; i < 9; i ++) {
        const email = "user" + i + "@example.com";
        const password = crackPasswordList[i];
        const existingUser = await findUserByEmail(email);

        if(!existingUser) {
            createUser(email, password, false, RBAC.USER);
        }

    }
}


