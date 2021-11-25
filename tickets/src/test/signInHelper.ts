import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

export const signIn = () => {
  // Define a payload for jwt
  const payload = {
    id: "619f21a3a0651c3e94c4e985",
    email: "test@test.com",
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode into base64
  const base64Token = Buffer.from(sessionJSON).toString("base64");

  // return string which is cookie with encoded data

  return [`express:sess=${base64Token}`];
};
