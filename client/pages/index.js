import axios from "axios";
import buildClient from "../api/buildClient";

const LandingPage = ({ currentUser }) => {
  console.log("Client", currentUser);
  return currentUser ? (
    <h1>Yor are Signed In</h1>
  ) : (
    <h1>You are NOT Signed In</h1>
  );
};

export async function getServerSideProps(context) {
  console.log("LANDING PAGEEE");
  const client = buildClient(context);

  const { data } = await client.get("/api/users/currentuser");

  return {
    props: data,
  };
}

export default LandingPage;
