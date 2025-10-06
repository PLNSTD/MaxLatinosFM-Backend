import type { Request, Response, NextFunction } from "express";

// Middleware to protect admin routes
export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const isAdmin = req.cookies?.admin_session === "true";

  // If not admin, redirect to login
  if (!isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Otherwise, allow request to continue
  next();
}
