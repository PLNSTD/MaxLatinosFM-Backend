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
// app.post("/upload", upload.single("song"), async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload(req.file!.path, {
//       resource_type: "video", // audio/video
//       folder: "songs",
//     });

//     // TODO: Save to your DB here (result.secure_url, req.file.originalname, etc.)

//     res.json({
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });
