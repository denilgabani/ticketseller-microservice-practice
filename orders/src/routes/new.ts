import express, { NextFunction, Request, Response } from "express";
import {
  authorize,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requestValidator,
} from "@dgticketseller/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/Ticket";
import { Order } from "../models/Order";
import { OrderCreatedPublisher } from "../events/publishers/OrderCreatedPublisher";
import { natsWrapper } from "../NatsWrapper";

const router = express.Router();

const EXPIRATION_ORDER_TIME_WINDOW = 2 * 60; //2 Minutes

router.post(
  "/api/orders",
  authorize,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => {
        return mongoose.Types.ObjectId.isValid(input);
      })
      .withMessage("Provide a valid ticketId"),
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

    // Calculate an expiration date of this order
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + EXPIRATION_ORDER_TIME_WINDOW
    );

    //Build the order and save it to database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    //Publish an event that order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      userId: order.userId,
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
