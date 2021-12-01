import { app } from "./app";
import { dbConnect } from "./config/db";
import { natsConnect } from "./config/natsConnect";
import { TicketCreatedListener } from "./events/listeners/TicketCreatedListener";
import { TicketUpdatedListener } from "./events/listeners/TicketUpdatedListener";
import { natsWrapper } from "./NatsWrapper";

// Listen on port
const port = 4000;
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY env variable must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI env variable must be defined");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID env variable must be defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID env variable must be defined");
  }

  if (!process.env.NATS_URI) {
    throw new Error("NATS_URI env variable must be defined");
  }

  // Nats Connect
  natsConnect();

  // Start Listener after connecting to NATS
  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();

  // Database connect
  dbConnect();

  app.listen(port, () => {
    console.log(`Listening on ${port}!!!!!!!`);
  });
};

start();
