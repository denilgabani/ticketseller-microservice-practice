import { OrderCancelled, Publisher, Subjects } from "@dgticketseller/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelled> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
