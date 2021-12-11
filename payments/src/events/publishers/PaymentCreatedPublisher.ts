import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from "@dgticketseller/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
