import {
  Listener,
  NotFoundError,
  OrderCancelled,
  OrderStatus,
  Subjects,
} from "@dgticketseller/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/Order";
import { queueGroupName } from "./queueGroupName";

export class OrderCancelledListener extends Listener<OrderCancelled> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCancelled["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    msg.ack();
  }
}
