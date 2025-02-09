import express from "express";
import type { Request, Response } from "express";
import pool from "../config/db";
import { Product } from "../models/Product";

const router = express.Router();