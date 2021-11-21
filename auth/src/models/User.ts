import mongoose from "mongoose";
import { Password } from "../utils/password";

//An interface that describes the properties
// needed to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the property
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the property
// that a User document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide your email"],
    },
    password: {
      type: String,
      required: [true, "Please provide you password"],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

UserSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await Password.toHash(this.get("password"));
    this.set("password", hashedPassword);
  }

  done();
});

const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);

export { User };
