import { natsWrapper } from "../NatsWrapper";

const natsConnect = async () => {
  try {
    await natsWrapper.connect("ticketseller", "asdf", "http://nats-srv:4222");
  } catch (err) {
    console.error(err);
  }
};

export { natsConnect };
