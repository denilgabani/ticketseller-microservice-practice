import buildClient from "../../api/buildClient";

const OrderIndex = ({ orders = [] }) => {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);

  const { data } = await client.get("/api/orders");

  console.log(data);

  return {
    props: {
      orders: data,
    },
  };
}

export default OrderIndex;
