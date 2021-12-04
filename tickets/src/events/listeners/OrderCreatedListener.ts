import { Listener, OrderCreated, Subjects } from "@dgticketseller/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "../queueGroupName";

export class OrderCreatedListener extends Listener<OrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCreated["data"], msg: Message) {
    // Find the ticket associated with order
    const ticket = await Ticket.findById(data.ticket.id);

    // Check if ticket is present in db
    if (!ticket) {
      throw new Error("Ticket is not found");
    }

    // set the orderid to corrsponding to ticket in db
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();

    // ack the message
    msg.ack();
  }
}
