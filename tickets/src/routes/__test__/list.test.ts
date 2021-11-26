import request from "supertest";
import { app } from "../../app";
import { signIn } from "../../test/signInHelper";

const createTestTicket = () => {
  const title = "test ticket";
  const price = 50;
  return request(app).post("/api/tickets").set("Cookie", signIn()).send({
    title,
    price,
  });
};

it("provides the lists of tickets", async () => {
  await createTestTicket();
  await createTestTicket();
  await createTestTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);
  expect(response.body.length).toEqual(3);
});
