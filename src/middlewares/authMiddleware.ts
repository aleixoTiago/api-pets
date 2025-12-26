import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: number;
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não fornecido",
    });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({
      error: "Token inválido",
    });
  }
}
