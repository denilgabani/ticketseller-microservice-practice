import {
  authorize,
  NotAuthorizedError,
  NotFoundError,
} from "@dgticketseller/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../models/Order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  authorize,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      return next(new NotFoundError());
    }

    if (order.userId !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }

    res.status(200).send(order);
  }
);

export { router as showOrderRouter };
