// CRUD LOGIC FOR "bumpers" OBJECT
import path from "path";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  uploadBumperToCloudinary,
  deleteBumpersFromCloudinary,
} from "../services/cloudinaryService.js";
import { capitalizeWords, getAudioDuration } from "./utilities.js";

const prisma = new PrismaClient();

// Upload a new bumper
export const createBumper = async (req: Request, res: Response) => {
  console.log("Uploading bumper...");
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const durationInSeconds = await getAudioDuration(file);

    // Upload to Cloudinary
    const uploadResult = await uploadBumperToCloudinary(file);
    if (!uploadResult.success) {
      return res.status(500).json({ error: "Failed to upload bumper" });
    }

    // Save bumper metadata in DB
    const formattedTitle = capitalizeWords(title);

    const bumper = await prisma.bumper.create({
      data: {
        title: formattedTitle,
        duration: durationInSeconds,
        path: uploadResult.url!,
        storage_id: uploadResult.public_id!,
      },
    });

    console.log("Bumper upload success!");
    return res.status(201).json(bumper);
  } catch (error) {
    console.error("❌ Upload error", error);
    return res.status(500).json({ error: "Failed to create bumper" });
  }
};

// Delete a bumper
export const deleteBumper = async (req: Request, res: Response) => {
  console.log("Deleting bumper...");
  try {
    const { id } = req.params;

    const bumper = await prisma.bumper.findUnique({
      where: { id: Number(id) },
      select: { storage_id: true },
    });

    if (!bumper) return res.status(404).json({ error: "Bumper not found!" });

    // Delete from Cloudinary
    if (bumper.storage_id) {
      deleteBumpersFromCloudinary(bumper.storage_id);
    }

    // Delete from DB
    await prisma.bumper.delete({ where: { id: Number(id) } });

    console.log("Bumper deleted!");
    return res.status(204).send();
  } catch (error) {
    console.error("❌ Delete error", error);
    return res.status(500).json({ error: "Failed to delete bumper" });
  }
};

export const getAllBumpers = async (req: Request, res: Response) => {
  const songs = await prisma.bumper.findMany();
  return res.json(songs);
};
