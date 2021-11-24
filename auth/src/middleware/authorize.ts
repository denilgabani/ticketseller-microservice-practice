import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../error/notAuthorizedError";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    return next();
  }

  next();
};
