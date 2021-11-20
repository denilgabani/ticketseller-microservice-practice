import express from "express";
import errorHandler from "./middleware/errorHandler";
import { signUpRouter } from "./routes/signup";

// Initialize express app
const app = express();

// Body parser
app.use(express.json());

// Routes
app.use(signUpRouter);

// Error Handler - need to add after all routes have been added so error from routes will use this middleware
app.use(errorHandler);

// Listen on port
const port = 4000;
app.listen(port, () => console.log(`Listening on ${port}!!!!!!!`));
