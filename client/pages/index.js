const LandingPage = ({ currentUser }) => {
  console.log("Client", currentUser);
  return currentUser ? (
    <h1>Yor are Signed In</h1>
  ) : (
    <h1>You are NOT Signed In</h1>
  );
};

export async function getServerSideProps(context, client, currentUser) {
  return {
    props: {},
  };
}

export default LandingPage;
