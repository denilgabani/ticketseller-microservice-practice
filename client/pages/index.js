import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log("In browser", currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === "undefined") {
    // In server. window only exist for browser.
    // requests should be made to "http://ingress-nginx...."
    // It happens when url entered, refreshed, clicking link from different domain

    //domain for the service will be http://SERVICENAME.NAMESPACE.svc.cluster.local

    const { data } = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: req.headers,
      }
    );
    return data;
  } else {
    //   In Browser.
    // Request should be made with base url
    // Only happens when navigate to this from inside of app

    const { data } = await axios.get("/api/users/currentuser");
    return data;
  }

  return {};
};

export default LandingPage;
