import buildClient from "../api/buildClient";
const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);

  const { data } = await client.get("/api/tickets");

  return {
    props: {
      tickets: data,
    },
  };
}

export default LandingPage;
