import { TicketUpdatedEvent } from "@dgticketseller/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { natsWrapper } from "../../../NatsWrapper";
import { TicketUpdatedListener } from "../TicketUpdatedListener";

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // Create a ticket and save it to database
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test ticket",
    price: 120,
  });

  await ticket.save();
  // Create fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "updated title",
    price: 10000,
    userId: "fafa",
    version: ticket.version + 1,
  };
  //  Create fake message object with jest mock function
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all above
  return { listener, ticket, data, msg };
};

it("fetches, updates and save the update ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});
it("acknowledge that ticket is updated", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("ack function is not called if event has not correct version sequence", async () => {
  const { listener, ticket, data, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
