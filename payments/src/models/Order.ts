import { OrderStatus } from "@dgticketseller/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import mongoose from "mongoose";

interface OrderAttrs {
  id: string;
  status: OrderStatus;
  version: number;
  price: number;
  userId: string;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  version: number;
  price: number;
  userId: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = function (attrs: OrderAttrs) {
  return new Order({
    _id: attrs.id,
    status: attrs.status,
    userId: attrs.userId,
    version: attrs.version,
    price: attrs.price,
  });
};

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
