import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { authorize, currentUser } from "@dgticketseller/common";

const router = Router();
router.get(
  "/api/users/currentuser",
  currentUser,

  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
