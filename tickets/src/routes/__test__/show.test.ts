import request from "supertest";
import { app } from "../../app";

it("returns 404 when ticket wiht provided id not found", async () => {
  await request(app).get("/api/tickets/flfalj").send().expect(404);
});

it("returns provides details of ticket when ticket with given id found", async () => {
  const title = "test ticket";
  const price = 40;

  const response = await request(app)
    .post("/api/tickets")
    .send({
      title,
      price,
    })
    .expect(201);

  await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);
});
