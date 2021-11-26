import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { signIn } from "../../test/signInHelper";

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
it("returns 401 if user is not the owner of existing ticket", async () => {});
it("returns 400 if updated title or price of ticket is invalid", async () => {});
it("updates the ticket with provided title and price", async () => {});
