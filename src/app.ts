import express from "express";
import cors from "cors"; // CROSS-ORIGIN RESOURCE SHARING
import type { Request, Response } from "express";
import { songRouter } from "./routes/songRouter.js";
import { bumperRouter } from "./routes/bumperRouter.js";
import authRouter from "./routes/login.js";
import authLogoutRouter from "./routes/logout.js";
import cookieParser from "cookie-parser";
import checkRouter from "./routes/check.js";
import { adminAuth } from "./middlewares/adminAuth.js";

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
    credentials: true, // allow cookies to be sent
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// adminAuthorization
app.use("/songs/admin", adminAuth);
app.use("/bumpers/admin", adminAuth);

// Routes
app.use("/songs", songRouter);
app.use("/bumpers", bumperRouter);
app.use("/auth/login", authRouter);
app.use("/auth/login/check", checkRouter);
app.use("/auth/logout", authLogoutRouter);

export default app;
