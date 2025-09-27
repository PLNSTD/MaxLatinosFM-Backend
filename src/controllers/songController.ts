// CRUD LOGIC FOR "items" OBJECT
import path from "path";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSongs = async (req: Request, res: Response) => {
  const songs = await prisma.song.findMany();
  res.json(songs);
};

export const getSongById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const song = await prisma.song.findUnique({ where: { id: Number(id) } });

  if (!song) return res.status(404).json({ error: "Song not found" });

  res.json(song);
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
  const { title, artist, duration, path } = req.body;
  const song = await prisma.song.create({
    data: { title, artist, duration, path },
  });
  res.status(201).json(song);
};

export const updateSong = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, artist, path, duration } = req.body;
  const song = await prisma.song.update({
    where: { id: Number(id) },
    data: { title, artist, path, duration },
  });
  res.json(song);
};

export const deleteSong = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.song.delete({ where: { id: Number(id) } });
  res.status(204).send();
};
