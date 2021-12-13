import { OrderCreatedListener } from "./events/listeners/OrderCreatedListener";
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
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URI!
    );

    natsWrapper.client.on("connect", () => {});

    natsWrapper.client.on("close", () => {
      console.log("Connection to NATS closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (err) {
    console.error(err);
  }
  new OrderCreatedListener(natsWrapper.client).listen();
};

start();
