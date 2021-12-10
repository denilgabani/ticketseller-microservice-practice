import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/Order";
import { signIn } from "../../test/signInHelper";
import { OrderStatus } from "@dgticketseller/common";

it("returns 404 when trying to make payment request with orderId which is not present", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signIn())
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: "asdfgh",
    })
    .expect(404);
});

it("returns 401 when trying to make payment request with orderId but user who logged in is not the owner of order", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 200,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signIn())
    .send({
      orderId: order.id,
      token: "asdfg",
    })
    .expect(401);
});

it("returns 400 when trying to make payment request for cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 200,
    status: OrderStatus.Cancelled,
    userId: userId,
    version: 0,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signIn())
    .send({
      orderId: order.id,
      token: "asdfg",
    })
    .expect(400);
});
