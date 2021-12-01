import { authorize, requestValidator } from "@dgticketseller/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { TicketCreatedPublisher } from "../events/publishers/TicketCreatedPublisher";
import { Ticket } from "../models/Ticket";
import { natsWrapper } from "../NatsWrapper";
const router = Router();

router.post(
  "/api/tickets",
  authorize,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  requestValidator,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
