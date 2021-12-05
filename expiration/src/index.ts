import { natsConnect } from "./config/natsConnect";
import { natsWrapper } from "./NatsWrapper";

// Listen on port
const port = 4000;
const start = async () => {
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
};

start();
