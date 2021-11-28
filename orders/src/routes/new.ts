import express, { NextFunction, Request, Response } from "express";
import {
  authorize,
  BadRequestError,
  NotFoundError,
  requestValidator,
} from "@dgticketseller/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/Ticket";

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
  async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.body;

    // Verify that given order of ticket that ticket is in database
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return next(new NotFoundError());
    }

    // Check if given order of ticket that ticket is not reserved by another request of order

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      return next(new BadRequestError("Ticket is already reserved"));
    }

    res.status(201).send({});
  }
);

export { router as createOrderRouter };
