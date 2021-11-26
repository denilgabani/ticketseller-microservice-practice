import request from "supertest";
import { app } from "../../app";
import { signIn } from "../../test/signInHelper";
import mongoose from "mongoose";

it("returns 404 when ticket with provided id not found", async () => {
  const fakeId = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${fakeId}`).send().expect(404);
});

it("provides details of ticket when ticket with given id found", async () => {
  const title = "test ticket";
  const price = 40;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketTest = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
  expect(ticketTest.body.title).toEqual(title);
  expect(ticketTest.body.price).toEqual(price);
});
