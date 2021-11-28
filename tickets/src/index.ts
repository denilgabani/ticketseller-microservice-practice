import { app } from "./app";
import { dbConnect } from "./config/db";
import { natsConnect } from "./config/natsConnect";

// Listen on port
const port = 4000;
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY env variable must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI env variable must be defined");
  }

  // Nats Connect
  natsConnect();

  // Database connect
  dbConnect();

  app.listen(port, () => {
    console.log(`Listening on ${port}!!!!!!!`);
  });
};

start();
