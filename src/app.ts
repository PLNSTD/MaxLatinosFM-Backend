import express from "express";
import cors from "cors"; // CROSS-ORIGIN RESOURCE SHARING
import type { Request, Response } from "express";
import { songRouter } from "./routes/songRouter.js";
import { bumperRouter } from "./routes/bumperRouter.js";

const app = express();

const allowedOrigins = [
  "https://maxlatinosfm.com",
  "https://max-latinos-fm-plidhers-projects.vercel.app",
  "http://localhost:3000",
  "https://max-latinos-70hgrik5l-plidhers-projects.vercel.app",
];

// Allow requests from frontend
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/songs", songRouter);
app.use("/bumpers", bumperRouter);

export default app;
