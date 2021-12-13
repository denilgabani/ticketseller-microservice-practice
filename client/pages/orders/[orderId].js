import { useEffect, useState } from "react";
import buildClient from "../../api/buildClient";
import StripeCheckout from "react-stripe-checkout";
import { useRequest } from "../../hooks/useRequest";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payments) => Router.push("/orders"),
  });

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

  return (
    <>
      <div>
        <p>{timeLeft} seconds left to pay for the order</p>
        <br />
        <StripeCheckout
          stripeKey="pk_test_51K5DqNSJ4825hr5WFniUfD10Aep1O8Q7yauDVIlL9hJvCJAQTFSVRJC8VsrA50k0kjT4dUg1q5vBiQpVl00zxyTG00TuXRakWg"
          token={({ id }) => doRequest({ token: id })}
          amount={order.price * 100}
          email={currentUser.email}
        />
      </div>
    </>
  );
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
