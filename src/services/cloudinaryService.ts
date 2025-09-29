import express from "express";
import multer from "multer";
import cloudinary from "./cloudinaryConfig.js";

const upload = multer({ dest: "uploads/" });
const app = express();

export const uploadSongToCloudinary = async (file: Express.Multer.File) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "video", // audio/video
      folder: "songs",
    });
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return {
      success: false,
      url: null,
      public_id: null,
    };
  }
};

export const deleteSongFromCloudinary = async (storage_id: string) => {
  await cloudinary.uploader.destroy(storage_id);
};

export const uploadBumperToCloudinary = async (file: Express.Multer.File) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "video", // audio/video
      folder: "bumpers",
    });
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return {
      success: false,
      url: null,
      public_id: null,
    };
  }
};

export const deleteBumpersFromCloudinary = async (storage_id: string) => {
  await cloudinary.uploader.destroy(storage_id);
};
