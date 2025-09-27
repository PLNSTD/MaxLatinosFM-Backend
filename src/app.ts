import express from "express";
import cors from "cors"; // CROSS-ORIGIN RESOURCE SHARING
import type { Request, Response } from "express";
import { songRouter } from "./routes/songRouter.js";

const app = express();

const allowedOrigins = ["maxlatinosfm.com"];

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

export default app;
