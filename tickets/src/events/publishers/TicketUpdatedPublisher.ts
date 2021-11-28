import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@dgticketseller/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
