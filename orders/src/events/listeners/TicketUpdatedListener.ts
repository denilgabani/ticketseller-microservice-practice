import { Listener, Subjects, TicketUpdatedEvent } from "@dgticketseller/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket Not Found");
    }

    const { title, price } = data;

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
