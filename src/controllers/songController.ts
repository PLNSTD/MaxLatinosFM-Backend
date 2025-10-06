// CRUD LOGIC FOR "items" OBJECT
import path from "path";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  deleteSongFromCloudinary,
  uploadSongToCloudinary,
} from "../services/cloudinaryService.js";
import {
  capitalizeWords,
  durationToSeconds,
  getAudioDuration,
} from "./utilities.js";
import { radioQueue } from "../services/RadioManager.js";

const prisma = radioQueue.getPrisma();

export const getNowPlaying = async (req: Request, res: Response) => {
  const { song, elapsed } = radioQueue.getCurrentSong();
  if (!song) return res.json(404).json({ error: "Song not found!" });
  return res.json({ song, elapsed });
};

export const getAllSongs = async (req: Request, res: Response) => {
  const cookieHeader = req.headers.cookie ?? "";
  const isAdmin = cookieHeader.includes("admin_session=true");

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const songs = await prisma.song.findMany();
  return res.status(200).json(songs);
};

export const setNowPlaying = async (req: Request, res: Response) => {
  // const cookieHeader = req.headers.cookie ?? "";
  // const isAdmin = cookieHeader.includes("admin_session=true");

  // if (!isAdmin) {
  //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
  //     status: 401,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // }

  const { id } = req.params;
  console.log(`Setting new song ID: ${id}`);
  radioQueue.setCurrentSong(Number(id));
  const elapsed = radioQueue.getElapsed();
  const song = await prisma.song.findUnique({ where: { id: Number(id) } });

  if (!song) return res.status(404).json({ error: "Song not found!" });

  return res.json({ song, elapsed });
};

// export const getSongById = async (songId: Number) => {

//   const song = await prisma.song.findUnique({ where: { id: Number(songId) } });

//   if (!song) return null;

//   return song;
// };

// export const getSongAudioById = async (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   const isAdmin = req.cookies.admin_session === "true";
//   if (!isAdmin) return res.status(401).json({ error: "Unauthorized" });

//   const { id } = req.query;
//   const song = await prisma.song.findUnique({ where: { id: Number(id) } });

//   if (!song) return res.status(404).send("Song not found");

//   res.header("Content-Type", "audio/mpeg");
//   console.log("Sending" + path.resolve(song.path));
//   res.sendFile(path.resolve(song.path));
// };

export const createSong = async (req: Request, res: Response) => {
  const cookieHeader = req.headers.cookie ?? "";
  const isAdmin = cookieHeader.includes("admin_session=true");

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("Uploading song..");
  try {
    const { title, artist } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const durationInSeconds = await getAudioDuration(file);

    // Upload to storage
    const uploadResult = await uploadSongToCloudinary(file);

    const formattedTitle = capitalizeWords(title);
    const formattedArtist = capitalizeWords(artist);

    if (!uploadResult.success) {
      return res.status(500).json({ error: "Failed to upload song" });
    }

    // Save song metadata + URL in DB
    const song = await prisma.song.create({
      data: {
        title: formattedTitle,
        artist: formattedArtist,
        duration: durationInSeconds,
        path: uploadResult.url!,
        storage_id: uploadResult.public_id!,
      },
    });

    console.log("Success!");
    return res.status(201).json(song);
  } catch (error) {
    console.error("❌ Delete error", error);
    return res.status(500).json({ error: "Failed to create song" });
  }
};

export const updateSong = async (req: Request, res: Response) => {
  const cookieHeader = req.headers.cookie ?? "";
  const isAdmin = cookieHeader.includes("admin_session=true");

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id } = req.params;
    const { title, artist, path } = req.body;

    const song = await prisma.song.update({
      where: { id: Number(id) },
      data: { title, artist, path },
    });

    return res.json(song);
  } catch (error) {
    console.error("Update failed:", error);
    return res.status(500).json({ error: "Failed to update song" });
  }
};

export const deleteSong = async (req: Request, res: Response) => {
  const cookieHeader = req.headers.cookie ?? "";
  const isAdmin = cookieHeader.includes("admin_session=true");

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("Deleting song..");
  try {
    const { id } = req.params;
    const song = await prisma.song.findUnique({
      where: { id: Number(id) },
      select: { storage_id: true },
    });

    if (!song) return res.status(404).json({ error: "Song not found!" });

    // Delete from cloudinary
    if (song.storage_id) {
      deleteSongFromCloudinary(song.storage_id);
    }

    // Delete from DB
    await prisma.song.delete({ where: { id: Number(id) } });
    console.log("Success!");
    radioQueue.clearQueue();
    return res.status(204).send("Success!");
  } catch (error) {
    console.error("❌ Delete error", error);
    return res.status(500).json({ error: "Failed to delete song" });
  }
};
