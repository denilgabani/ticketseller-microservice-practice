import express from "express";
import dbConnect from "./config/db";
import { NotFoundError } from "./error/notFoundError";
import errorHandler from "./middleware/errorHandler";
import { signUpRouter } from "./routes/signup";

// Initialize express app
const app = express();

// Body parser
app.use(express.json());

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
app.listen(port, () => console.log(`Listening on ${port}!!!!!!!`));
