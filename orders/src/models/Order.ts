import mongoose from "mongoose";
import { TicketDoc } from "./Ticket";

import { OrderStatus } from "@dgticketseller/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// interface used to define
// Attribute we can passed to create document in model
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// Interface used for defining document which will return mongoose from db
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  version: number;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that describes the property
// in a Model
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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

OrderSchema.set("versionKey", "version");
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", OrderSchema);

export { Order };
