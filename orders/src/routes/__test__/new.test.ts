import { OrderStatus } from "@dgticketseller/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/Order";
import { Ticket } from "../../models/Ticket";
import { natsWrapper } from "../../NatsWrapper";
import { signIn } from "../../test/signInHelper";

it("returns an error if the ticket is not in database", async () => {
  const ticketId = mongoose.Types.ObjectId.generate().toString("hex");
  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error if ticket from current order is already reserved by other order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test Ticket",
    price: 100,
  });

  await ticket.save();

  const order = Order.build({
    userId: "randomid",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("successfully reserves the ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test Ticket",
    price: 100,
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it("Publish an event OrderCreated", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test Ticket",
    price: 100,
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
