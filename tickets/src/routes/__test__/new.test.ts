import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import { signIn } from "../../test/signInHelper";
import { natsWrapper } from "../../NatsWrapper";

it("must handle router /api/tickets", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.statusCode).not.toEqual(404);
});

it("can only allow to access if user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("return other than 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({});
  expect(response.statusCode).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      price: 10,
    })
    .expect(400);
});
it("returns an error if invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title: "test ticket",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title: "test ticket",
    })
    .expect(400);
});
it("creates a ticket with valid inputs", async () => {
  // add condition to check the data inserted in database

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "test ticket";
  const price = 100;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title,
      price,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

it("publishes an event", async () => {
  const title = "test ticket";
  const price = 100;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title,
      price,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
