import {
  authorize,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@dgticketseller/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../models/Order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  authorize,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new NotFoundError());
    }

    if (order.userId !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    // Publish an event that order is cancelled

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
