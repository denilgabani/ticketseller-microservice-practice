import { authorize, NotFoundError } from "@dgticketseller/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/Test";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  authorize,
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return next(new NotFoundError());
    }
    res.status(200).send({});
  }
);

export { router as updateTicketRouter };
