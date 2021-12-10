import {
  Listener,
  OrderCreated,
  OrderStatus,
  Subjects,
} from "@dgticketseller/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/Order";
import { queueGroupName } from "./queueGroupName";

export class OrderCreatedListener extends Listener<OrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreated["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      status: data.status,
      version: data.version,
      price: data.ticket.price,
      userId: data.userId,
    });

    await order.save();

    msg.ack();
  }
}
