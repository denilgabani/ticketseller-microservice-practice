import { natsWrapper } from "../NatsWrapper";

const natsConnect = async () => {
  try {
    await natsWrapper.connect("ticketseller", "asdf", "http://nats-srv:4222");

    natsWrapper.client.on("close", () => {
      console.log("Connection to NATS closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (err) {
    console.error(err);
  }
};

export { natsConnect };
