import cookieSession from "cookie-session";
import express from "express";
import {
  NotFoundError,
  errorHandler,
  currentUser,
} from "@dgticketseller/common";
import { newPaymentRouter } from "./routes/new";

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
    secure: process.env.NODE_ENV !== "test",
  })
);

//if user is signed in then currentUser will set req.currentUser
app.use(currentUser);

// Routes
app.use(newPaymentRouter);

// If route is not from above path
app.all("*", async (req, res, next) => {
  return next(new NotFoundError());
});

// Error Handler - need to add after all routes have been added so error from routes will use this middleware
app.use(errorHandler);

export { app };
