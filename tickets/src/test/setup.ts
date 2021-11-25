import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

let mongo: any;
let con: any;

beforeAll(async () => {
  // Environment variable setup for test cases
  process.env.JWT_KEY = "thisistestjwtsecret";

  mongo = await MongoMemoryServer.create({ binary: { version: "4.2.6" } });

  const mongoUri = mongo.getUri();

  con = await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  if (con) {
    await mongoose.connection.close();
  }
});
