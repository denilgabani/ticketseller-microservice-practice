import { TicketCreatedEvent } from "@dgticketseller/common";
import { natsWrapper } from "../../../NatsWrapper";
import { TicketCreatedListener } from "../TicketCreatedListener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";

const setup = () => {
  // Creates TicketCreatedListener instance
  const listener = new TicketCreatedListener(natsWrapper.client);
  //Create data for TicketCreated Event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test ticket",
    price: 123,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };
  //   Create fake Message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it("Creates and saves ticket from event", async () => {
  const { listener, data, msg } = setup();

  //call onMessage using TicketCreatedListener instance by passing data + message

  await listener.onMessage(data, msg);
  //   Assertion statement to check if ticket is created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it("acknowledge after creating the ticket", async () => {
  const { listener, data, msg } = setup();
  //call onMessage using TicketCreatedListener instance by passing data + message
  await listener.onMessage(data, msg);
  //   Assertion statement to check ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
