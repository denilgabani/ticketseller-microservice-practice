import { OrderStatus } from "@dgticketseller/common";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/Order";
import { Ticket } from "../../models/Ticket";
import { signIn } from "../../test/signInHelper";

it("changes the status of order to cancelled", async () => {
  // Create a ticket
  const ticket = Ticket.build({
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

  // Cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // Check if order status has been change to cancel
  const canceledOrder = await Order.findById(order.id);

  expect(canceledOrder?.status).toEqual(OrderStatus.Cancelled);
});

it.todo("publish an even when order is cancelled");
