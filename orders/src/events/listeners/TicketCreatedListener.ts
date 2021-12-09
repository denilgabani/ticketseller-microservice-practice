import { Listener, Subjects, TicketCreatedEvent } from "@dgticketseller/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price } = data;

    const ticket = Ticket.build({
      id: data.id,
      title: data.title,
      price: data.price,
    });
    await ticket.save();

    const ticketstest = await Ticket.find({});
    msg.ack();
  }
}
