import { OrderCreated, Publisher, Subjects } from "@dgticketseller/common";

export class OrderCreatedPublisher extends Publisher<OrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
