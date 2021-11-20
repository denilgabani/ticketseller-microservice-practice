import express from "express";

// Initialize express app
const app = express();

// Body parser
app.use(express.json());

// Routes
app.use("/api/users/currentuser", (req, res) => {
  res.send("hi");
});

// Listen on port
const port = 4000;
app.listen(port, () => console.log(`Listening on ${port}!!!!!!!`));
