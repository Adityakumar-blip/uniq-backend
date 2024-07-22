const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const routes = require("./src/routes/routes");
const app = express();
const PORT = 3001;

app.use(cors());

app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_STRING);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB database");
});

app.get("/", (req, res) => {
  res.send("Hello, world, this is aditya!");
});

app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
