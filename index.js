const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

mongoose.connect(
  "mongodb+srv://aditya1:E2W8qAaEGlcgCRCt@cluster0.us3sq8s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB database");
});

app.get("/", (req, res) => {
  res.send("Hello, world, this is aditya!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
