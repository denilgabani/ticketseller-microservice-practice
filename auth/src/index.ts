import cookieSession from "cookie-session";
import express from "express";
import dbConnect from "./config/db";
import { NotFoundError } from "./error/notFoundError";
import errorHandler from "./middleware/errorHandler";
import { signUpRouter } from "./routes/signup";

// Initialize express app
const app = express();

// Trusting proxy - as traffic proxying through ingress nginx so we are allowing it
app.set("trust proxy", true);

// Body parser
app.use(express.json());

// Setting cookie with signed: false (to disable encryption)
// as jwt token itself will be encrypt and cookie encryption
// will be different for every language so for independet microservice we are disabling it
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

// Database connect
dbConnect();

// Routes
app.use(signUpRouter);

// If route is not from above path
app.all("*", async (req, res, next) => {
  return next(new NotFoundError());
});

// Error Handler - need to add after all routes have been added so error from routes will use this middleware
app.use(errorHandler);

// Listen on port
const port = 4000;
app.listen(port, () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY env variable must be defined");
  }
  console.log(`Listening on ${port}!!!!!!!`);
});
