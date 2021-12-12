import { useEffect, useState } from "react";
import buildClient from "../../api/buildClient";

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();

    const intervalId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order is expired please create another order. Thanks!</div>;
  }

  return <div>{timeLeft} seconds left to pay for the order</div>;
};

export async function getServerSideProps(context) {
  const client = buildClient(context);

  const { orderId } = context.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return {
    props: {
      order: data,
    },
  };
}

export default OrderShow;
