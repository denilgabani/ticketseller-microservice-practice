import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import { signIn } from "../../test/signInHelper";
import mongoose from "mongoose";

it("returns order with given orderId", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test ticket",
    price: 50,
  });

  await ticket.save();

  // Make a order to reserve this ticket
  const user = signIn();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // Get this order by order with the same user as order creator
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns Not Autorized if one user try to access another user's order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test ticket",
    price: 50,
  });

  await ticket.save();

  // Make a order to reserve this ticket
  const user = signIn();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // Get this order by order with the same user as order creator
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", signIn())
    .send()
    .expect(401);
});
