import mongoose from "mongoose";

// interface used to define
// Attribute we can passed to create document in model
interface TicketAttr {
  title: string;
  price: number;
}

// Interface used for defining document which will return mongoose from db
export interface TicketDoc {
  title: string;
  price: number;
}

// An interface that describes the property
// in a Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttr): TicketDoc;
}

const TickeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

TickeSchema.statics.build = (attrs: TicketAttr) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", TickeSchema);

export { Ticket };
