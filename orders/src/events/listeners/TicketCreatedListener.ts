import { Listener, Subjects, TicketCreatedEvent } from "@dgticketseller/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {}
}
