const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const serverless = require("serverless-http");
const routes = require("./src/routes/routes");
const User = require("./src/models/User");
const app = express();
const PORT = 3001;

app.use(cors());

app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_STRING);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB database");
  seedSuperAdmin();
});

async function seedSuperAdmin() {
  try {
    const superAdminExists = await User.findOne({ role: "superadmin" });

    if (!superAdminExists) {
      const hashedPassword = await bcrypt.hash("Test@123", 10);

      const superAdmin = new User({
        username: "superadmin",
        email: "adityakamal303@gmail.com",
        password: hashedPassword,
        role: "superadmin",
      });

      await superAdmin.save();
      console.log("Superadmin user created successfully");
    } else {
      console.log("Superadmin user already exists");
    }
  } catch (error) {
    console.error("Error seeding superadmin:", error);
  }
}

app.get("/", (req, res) => {
  res.send("Hello, world, this is aditya!");
});

app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
