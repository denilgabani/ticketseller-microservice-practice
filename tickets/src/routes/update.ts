import {
  authorize,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requestValidator,
} from "@dgticketseller/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/TicketUpdatedPublisher";
import { Ticket } from "../models/Ticket";
import { natsWrapper } from "../NatsWrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  authorize,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Please provide the title of ticket"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price should be greater than 0"),
  ],
  requestValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return next(new NotFoundError());
    }

    if (ticket.userId !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }

    if (ticket.orderId) {
      return next(new BadRequestError("Ticket is already reserved"));
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
