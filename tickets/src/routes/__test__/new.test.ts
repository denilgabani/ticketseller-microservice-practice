import request from "supertest";
import { app } from "../../app";

it("must handle router /api/tickets/new", async () => {
  const response = await request(app).post("/api/tickets/new").send({});

  expect(response.statusCode).not.toEqual(404);
});
it("can only allow to access if user is signed in", async () => {});
it("returns an error if invalid title is provided", async () => {});
it("returns an error if invalid price is provided", async () => {});
it("creates a ticket with valid inputs", async () => {});
