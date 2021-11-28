import { NotFoundError } from "@dgticketseller/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/Ticket";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        return next(new NotFoundError());
      }

      res.status(200).send(ticket);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as showTicketRouter };
