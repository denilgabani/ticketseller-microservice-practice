import { authorize } from "@dgticketseller/common";
import express, { Request, Response } from "express";
import { Order } from "../models/Order";

const router = express.Router();

router.get("/api/orders", authorize, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    "ticket"
  );
  res.status(200).send(orders);
});

export { router as listOrderRouter };
