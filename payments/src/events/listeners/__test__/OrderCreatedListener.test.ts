import { OrderCreated, OrderStatus } from "@dgticketseller/common";
import { natsWrapper } from "../../../NatsWrapper";
import { OrderCreatedListener } from "../OrderCreatedListener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/Order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreated["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: "ffafa",
    expiresAt: "fa",
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 100,
    },
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("copy of the order when order is created", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it("ack after order is created in database", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
