import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();
router.post(
  "/api/users/signout",
  async (req: Request, res: Response, next: NextFunction) => {
    req.session = null;

    res.status(200).send({});
  }
);

export { router as signOutRouter };
