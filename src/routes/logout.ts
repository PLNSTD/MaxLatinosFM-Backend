import { Router } from "express";
import type { Request, Response } from "express";
import { serialize } from "cookie";

const authLogoutRouter = Router();

authLogoutRouter.post("/", (req: Request, res: Response) => {
  // Clear the admin_session cookie
  const cookie = serialize("admin_session", "", {
    path: "/",
    maxAge: 0, // expires immediately
  });

  res.setHeader("Set-Cookie", cookie);
  return res.status(200).json({ success: true });
});

export default authLogoutRouter;
