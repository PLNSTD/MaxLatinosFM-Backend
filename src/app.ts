import express from "express";
import cors from "cors"; // CROSS-ORIGIN RESOURCE SHARING
import type { Request, Response } from "express";
import { songRouter } from "./routes/songRouter.js";

const app = express();

// Allow requests from frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "https://maxlatinosfm.com"],
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/songs", songRouter);

export default app;
