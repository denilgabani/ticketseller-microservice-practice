import request from "supertest";
import { app } from "../../app";
import { signIn } from "../../test/signInHelper";

it("must handle router /api/tickets/new", async () => {
  const response = await request(app).post("/api/tickets/new").send({});

  expect(response.statusCode).not.toEqual(404);
});

it("can only allow to access if user is signed in", async () => {
  await request(app).post("/api/tickets/new").send({}).expect(401);
});

it("return other than 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets/new")
    .set("Cookie", signIn())
    .send({});
  expect(response.statusCode).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {});
it("returns an error if invalid price is provided", async () => {});
it("creates a ticket with valid inputs", async () => {});
