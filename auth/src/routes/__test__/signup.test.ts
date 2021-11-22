import request from "supertest";
import { app } from "../../app";

it("returns 201 with successful user creation in db", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);
});

it("returns 400 when email is entered wrong", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test",
      password: "123456",
    })
    .expect(400);
});

it("returns 400 when password is not in current length", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123",
    })
    .expect(400);
});

it("returns 400 when email or password or both is not provided", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "123456",
    })
    .expect(400);

  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("returns 400 when account is already registered with provided email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
