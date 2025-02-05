import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Request, Response } from "express";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const dir = path.join(__dirname, "../../public/products");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
    if (!file) {
        cb(null, false);
    }
  if (file.mimetype === "image/webp" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter }).single("file");


export default upload;
