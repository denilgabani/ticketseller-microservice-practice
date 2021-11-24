import buildClient from "../api/buildClient";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>Yor are Signed In</h1>
  ) : (
    <h1>You are NOT Signed In</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log("LANDING PAGEEE");
  const client = buildClient(context);

  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default LandingPage;
