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
import { Order } from "../models/Order";

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

    res.status(200).send({ success: true });
  }
);

export { router as newPaymentRouter };
