// EXPRESS ROUTES FOR items
import { Router } from "express";
import multer from "multer";
import {
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  getSongAudioById,
  getNowPlaying,
  setNowPlaying,
} from "../controllers/songController.js";

export const songRouter = Router();
const upload = multer({ dest: "uploads/" });

// GET /api/songs/now -> getNowPlaying
songRouter.get("/now", getNowPlaying);

// GET /api/songs -> get all songs
songRouter.get("/list", getAllSongs);

// GET /api/songs/:id -> get a song by ID
// songRouter.get("/:id", getSongById);

// GET /api/songs/:id -> set a song by ID
songRouter.get("/:id", setNowPlaying);

// GET /api/songs/:id/audio -> get a song audio by ID
// songRouter.get("/:id/audio", getSongAudioById);

// POST /api/upload -> add a song
songRouter.post("/upload", upload.single("song"), createSong);

// PUT /api/songs/:id -> update a song
songRouter.put("/:id", updateSong);

// DELETE /api/songs/:id -> delete a song
songRouter.delete("/:id", deleteSong);
