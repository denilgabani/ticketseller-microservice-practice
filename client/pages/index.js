import axios from "axios";

const LandingPage = () => {
  console.log("In browser");
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async () => {
  if (typeof window === "undefined") {
    // In server. window only exist for browser.
    // requests should be made to "http://ingress-nginx...."
    // It happens when url entered, refreshed, clicking link from different domain
    console.log("In server");
  } else {
    //   In Browser.
    // Request should be made with base url
    // Only happens when navigate to this from inside of app
  }

  return {};
};

export default LandingPage;
