import {
  authorize,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requestValidator,
} from "@dgticketseller/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events/publishers/PaymentCreatedPublisher";
import { Order } from "../models/Order";
import { Payment } from "../models/Payment";
import { natsWrapper } from "../NatsWrapper";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
  "/api/payments",
  authorize,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  requestValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, token } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new NotFoundError());
    }

    if (order.userId !== req.currentUser?.id) {
      return next(new NotAuthorizedError());
    }

    if (order.status === OrderStatus.Cancelled) {
      return next(
        new BadRequestError(
          "Payment request can not be made for cancelled order"
        )
      );
    }

    const charge = await stripe.charges.create({
      currency: "inr",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId: orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as newPaymentRouter };
