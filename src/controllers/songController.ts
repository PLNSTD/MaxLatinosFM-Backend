// CRUD LOGIC FOR "items" OBJECT
import path from "path";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  deleteSongFromCloudinary,
  uploadSongToCloudinary,
} from "../services/cloudinaryService.js";
import { durationToSeconds, getAudioDuration } from "./utilities.js";
import { radioQueue } from "../services/RadioManager.js";

const prisma = radioQueue.getPrisma();

export const getNowPlaying = async (req: Request, res: Response) => {
  const { song, elapsed } = radioQueue.getCurrentSong();
  if (!song) return res.json(404).json({ error: "Song not found!" });
  return res.json({ song, elapsed });
};

export const getAllSongs = async (req: Request, res: Response) => {
  const songs = await prisma.song.findMany();
  return res.json(songs);
};

export const getSongById = async (songId: Number) => {
  const song = await prisma.song.findUnique({ where: { id: Number(songId) } });

  if (!song) return null;

  return song;
};

export const getSongAudioById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const song = await prisma.song.findUnique({ where: { id: Number(id) } });

  if (!song) return res.status(404).send("Song not found");

  res.header("Content-Type", "audio/mpeg");
  console.log("Sending" + path.resolve(song.path));
  res.sendFile(path.resolve(song.path));
};

export const createSong = async (req: Request, res: Response) => {
  console.log("Uploading song..");
  try {
    const { title, artist, duration } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const durationInSeconds = await getAudioDuration(file);

    // Upload to storage
    const uploadResult = await uploadSongToCloudinary(file);

    if (!uploadResult.success) {
      return res.status(500).json({ error: "Failed to upload song" });
    }

    // Save song metadata + URL in DB
    const song = await prisma.song.create({
      data: {
        title,
        artist,
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
  const { id } = req.params;
  const { title, artist, path, duration } = req.body;
  const song = await prisma.song.update({
    where: { id: Number(id) },
    data: { title, artist, path, duration },
  });
  return res.json(song);
};

export const deleteSong = async (req: Request, res: Response) => {
  console.log("Deleting song..");
  try {
    const { id } = req.params;
    const song = await prisma.song.findUnique({
      where: { id: Number(id) },
      select: { storage_id: true },
    });

    if (!song) return res.json(404).json({ error: "Song not found!" });

    // Delete from cloudinary
    if (song.storage_id) {
      deleteSongFromCloudinary(song.storage_id);
    }

    // Delete from DB
    await prisma.song.delete({ where: { id: Number(id) } });
    console.log("Success!");
    return res.status(204).send();
  } catch (error) {
    console.error("❌ Delete error", error);
    return res.status(500).json({ error: "Failed to delete song" });
  }
};
