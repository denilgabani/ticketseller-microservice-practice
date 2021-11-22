import request from "supertest";
import { app } from "../app";

export const signIn = async () => {
  const email = "test@test.com";
  const password = "123456";
  const response = await request(app).post("/api/users/signup").send({
    email,
    password,
  });

  const cookie = response.get("Set-Cookie");

  return cookie;
};
