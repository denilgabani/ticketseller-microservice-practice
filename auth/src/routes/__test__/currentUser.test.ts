import request from "supertest";
import { app } from "../../app";
import { signIn } from "../../test/signInHelper";

it("respond with details of current user signed in", async () => {
  const cookie = await signIn();

  // We have to take cookie from response and manually add it to the currentUser request
  // as supertest does not add automatically unlike browser or postman
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("respond with null if user is not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body.currentUser).toBeNull();
});
