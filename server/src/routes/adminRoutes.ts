import express from "express";
import type { Request, Response } from "express";
import { errors } from "../data/errors";
import { fetchUserDetails, fetchUserDetailsUnrestricted } from "../controllers/userController";
import { flags } from "../data/flags";

const router = express.Router();

export default router;
