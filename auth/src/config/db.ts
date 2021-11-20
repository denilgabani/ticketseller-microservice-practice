import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const con = await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log(`Mongodb connected to ${con.connection.host}`);
  } catch (err) {
    console.error(err);
  }
};

export default dbConnect;
