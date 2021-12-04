import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { signIn } from "../../test/signInHelper";
import { natsWrapper } from "../../NatsWrapper";
import { Ticket } from "../../models/Ticket";

it("returns 404 if provide id for ticket not found", async () => {
  const fakeId = new mongoose.Types.ObjectId().toHexString();

  const title = "Test ticket";
  const price = 40;

  await request(app)
    .put(`/api/tickets/${fakeId}`)
    .set("Cookie", signIn())
    .send({
      title,
      price,
    })
    .expect(404);
});
it("returns 401 if user who want to change ticket is not signed in", async () => {
  const fakeId = new mongoose.Types.ObjectId().toHexString();

  const title = "Test ticket";
  const price = 40;

  await request(app)
    .put(`/api/tickets/${fakeId}`)
    .send({
      title,
      price,
    })
    .expect(401);
});
it("returns 401 if user is not the owner of existing ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title: "testttt",
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", signIn())
    .send({
      title: "updated ticket",
      price: 20,
    })
    .expect(401);
});
it("returns 400 if updated title or price of ticket is invalid", async () => {
  const cookie = signIn();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "testttt",
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Update ticket",
      price: -20,
    })
    .expect(400);
});
it("updates the ticket with provided title and price", async () => {
  const cookie = signIn();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "testttt",
      price: 10,
    })
    .expect(201);

  const updatedTitle = "Updated ticket";
  const updatedPrice = 500;

  const updatedResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  expect(updatedResponse.body.title).toEqual(updatedTitle);
  expect(updatedResponse.body.price).toEqual(updatedPrice);
});

it("publishes an event", async () => {
  const cookie = signIn();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "testttt",
      price: 10,
    })
    .expect(201);

  const updatedTitle = "Updated ticket";
  const updatedPrice = 500;

  const updatedResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects the update request of ticket if ticket is already reserved", async () => {
  const cookie = signIn();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "testttt",
      price: 10,
    })
    .expect(201);

  // Manually assigning orderId to this ticket just to replicate event logic
  const ticket = await Ticket.findById(response.body.id);
  const orderId = new mongoose.Types.ObjectId().toHexString();

  ticket?.set({ orderId });

  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);
});
