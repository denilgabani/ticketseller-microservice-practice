import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`Mongodb connected to ${con.connection.host}`);
  } catch (err) {
    console.error(err);
  }
};

export { dbConnect };
