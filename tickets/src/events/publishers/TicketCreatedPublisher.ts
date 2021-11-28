import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@dgticketseller/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
