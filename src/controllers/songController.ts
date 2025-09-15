// CRUD LOGIC FOR "items" OBJECT
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

export const createSong = async (req: Request, res: Response) => {
  const { title, artist, duration } = req.body;
  const song = await prisma.song.create({ data: { title, artist, duration } });
  res.status(201).json(song);
};

export const updateSong = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, artist } = req.body;
  const song = await prisma.song.update({
    where: { id: Number(id) },
    data: { title, artist },
  });
  res.json(song);
};

export const deleteSong = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.song.delete({ where: { id: Number(id) } });
  res.status(204).send();
};
