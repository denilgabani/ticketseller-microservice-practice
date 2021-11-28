import express, { Request, Response } from "express";
import { authorize, requestValidator } from "@dgticketseller/common";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/orders",
  authorize,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => {
        mongoose.Types.ObjectId.isValid(input);
      })
      .withMessage("Provide a ticketId"),
  ],
  requestValidator,
  (req: Request, res: Response) => {
    res.status(201).send({});
  }
);

export { router as createOrderRouter };
