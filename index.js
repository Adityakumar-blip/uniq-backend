const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const routes = require("./src/routes/routes");
const app = express();
const PORT = 3000;

app.use(cors());

app.use("/uploads", express.static("uploads"));

// "mongodb+srv://unsolvedagency:rkegNgxjurqBdqjK@cluster0.auzkhib.mongodb.net/uniqq"
mongoose.connect("mongodb://127.0.0.1:27017/dlabss");
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
