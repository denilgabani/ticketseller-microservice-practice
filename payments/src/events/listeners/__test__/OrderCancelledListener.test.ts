import { OrderCancelled, OrderStatus } from "@dgticketseller/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/Order";
import { natsWrapper } from "../../../NatsWrapper";
import { OrderCancelledListener } from "../OrderCancelledListener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 110,
    version: 0,
    status: OrderStatus.Created,
    userId: "afafa",
  });

  await order.save();

  const data: OrderCancelled["data"] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: "hhkhkhk",
    },
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it("cancelled the order successfully", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const cancelledOrder = await Order.findOne({
    _id: order.id,
    version: order.version + 1,
  });

  expect(cancelledOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("ack after order is cancelled", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
