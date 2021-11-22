import request from "supertest";
import { app } from "../../app";

it("will send 201 with successful user creation in db", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);
});
