import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // We are in server
    // requests should be made to "http://ingress-nginx...."
    // It happens when url entered, refreshed, clicking link from different domain

    //domain for the service will be http://SERVICENAME.NAMESPACE.svc.cluster.local

    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We must be in browser
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
