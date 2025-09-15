// EXPRESS ROUTES FOR items
import { Router } from "express";
import {
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
} from "../controllers/songController.js";

export const songRouter = Router();

// GET /api/songs -> get all songs
songRouter.get("/", getAllSongs);

// GET /api/songs/:id -> get a song by ID
songRouter.get("/:id", getSongById);

// POST /api/songs -> add a song by ID
songRouter.post("/", createSong);

// PUT /api/songs/:id -> update a song
songRouter.put("/:id", updateSong);

// DELETE /api/songs/:id -> delete a song
songRouter.delete("/:id", deleteSong);
