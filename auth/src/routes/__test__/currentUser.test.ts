import request from "supertest";
import { app } from "../../app";

it("respond with details of current user signed in", async () => {
  const authResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  // We have to take cookie from response and manually add it to the currentUser request
  // as supertest does not add automatically unlike browser or postman
  const cookie = authResponse.get("Set-Cookie");
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});
