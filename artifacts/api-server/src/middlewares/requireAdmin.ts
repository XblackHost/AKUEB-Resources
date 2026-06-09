import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "akueb-help-secret";

interface AdminPayload {
  userId: number;
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      adminUser?: AdminPayload;
    }
  }
}

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SESSION_SECRET) as AdminPayload;

    if (!decoded.isAdmin) {
      res.status(403).json({ error: "Access denied. Admin privileges required." });
      return;
    }

    req.adminUser = decoded;
    next();
  } catch (error) {
    req.log.error({ err: error }, "JWT verification failed");
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
};
