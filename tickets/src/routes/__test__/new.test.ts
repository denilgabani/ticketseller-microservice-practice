import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Test";
import { signIn } from "../../test/signInHelper";

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

  await request(app)
    .post("/api/tickets")
    .send({
      title: "test ticket",
      price: 100,
    })
    .expect(201);
});
