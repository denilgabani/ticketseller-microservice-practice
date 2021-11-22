import request from "supertest";
import { app } from "../../app";

it("returns 400 when email is entered wrong", () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test",
      password: "123456",
    })
    .expect(400);
});

it("returns 400 when password is not supplied", () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
    })
    .expect(400);
});

it("returns 400 when given email is not registered", () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(400);
});

it("retruns 400 when give password is wrong", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "123456789",
    })
    .expect(400);
});
