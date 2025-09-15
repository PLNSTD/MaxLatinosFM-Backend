import express from "express";
import type { Request, Response } from "express";
import { songRouter } from "./routes/songRouter.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("./routes", songRouter);

export default app;
