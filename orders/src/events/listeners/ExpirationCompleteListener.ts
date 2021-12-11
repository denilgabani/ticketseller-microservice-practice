import {
  ExpirationCompleteEvent,
  Listener,
  NotFoundError,
  OrderStatus,
  Subjects,
} from "@dgticketseller/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/Order";
import { natsWrapper } from "../../NatsWrapper";
import { OrderCancelledPublisher } from "../publishers/OrderCancelledPublisher";
import { queueGroupName } from "./queueGroupName";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    // Publishing the OrderCancelled event
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
