import { Router } from "express";
import type { Request, Response } from "express";
import { serialize } from "cookie";

const authRouter = Router();

authRouter.post("/", (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Only allow correct credentials
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    // Set HttpOnly cookie for admin session
    const cookie = serialize("admin_session", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ success: true });
  }

  // Invalid credentials
  return res.status(401).json({ error: "Invalid credentials" });
});

export default authRouter;
