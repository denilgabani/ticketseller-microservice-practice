import { OrderCreated, OrderStatus } from "@dgticketseller/common";
import { Ticket } from "../../../models/Ticket";
import { natsWrapper } from "../../../NatsWrapper";
import { OrderCreatedListener } from "../OrderCreatedListener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // Create listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // Create a ticket and save to db
  const ticket = Ticket.build({
    title: "Test ticket",
    price: 200,
    userId: "asdf",
  });

  await ticket.save();

  //   Create fake data object
  const data: OrderCreated["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: "afaf",
    userId: "fafaf",
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // Create fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all the things
  return { listener, ticket, data, msg };
};

it("sets the orderid in ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("ack the message after setting order id", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket update event", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
