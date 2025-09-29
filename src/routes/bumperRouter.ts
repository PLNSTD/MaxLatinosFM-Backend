// EXPRESS ROUTES FOR bumpers
import { Router } from "express";
import multer from "multer";
import {
  getAllBumpers,
  createBumper,
  deleteBumper,
} from "../controllers/bumperController.js";

export const bumperRouter = Router();
const upload = multer({ dest: "uploads/" });

// GET /api/bumpers/list -> get all bumpers
bumperRouter.get("/list", getAllBumpers);

// POST /api/bumpers/upload -> upload a new bumper
bumperRouter.post("/upload", upload.single("bumper"), createBumper);

// DELETE /api/bumpers/:id -> delete a bumper
bumperRouter.delete("/:id", deleteBumper);
