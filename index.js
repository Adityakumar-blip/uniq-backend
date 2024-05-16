const express = require("express");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const routes = require("./src/routes/routes");
const app = express();
const PORT = 3000;

mongoose.connect(
  "mongodb+srv://unsolvedagency:rkegNgxjurqBdqjK@cluster0.auzkhib.mongodb.net/uniqq"
);
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
