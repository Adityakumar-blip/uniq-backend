// src/routes/routes.js
const express = require("express");
const projectRoutes = require("./ProjectRoute");
const userRoute = require("./UserRoute");

const router = express.Router();

router.use("/projects", projectRoutes);
router.use("/user", userRoute);

module.exports = router;
