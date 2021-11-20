import express from "express";

// Initialize express app
const app = express();

// Body parser
app.use(express.json());

// Listen on port
const port = 4000;
app.listen(port, () => console.log(`Listening on ${port}`));
