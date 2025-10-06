import express from "express";
import type { Request, Response } from "express";

const checkRouter = express.Router();

// Make sure you have cookie-parser middleware in your Express app:
// import cookieParser from "cookie-parser";
// app.use(cookieParser());

checkRouter.get("/", (req: Request, res: Response) => {
  // Check if admin_session cookie exists and is "true"
  const isAdmin = req.cookies?.admin_session === "true";

  if (!isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({ success: true });
});

export default checkRouter;
