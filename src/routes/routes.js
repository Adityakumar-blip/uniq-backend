// src/routes/routes.js
const express = require("express");
const projectRoutes = require("./ProjectRoute");
const userRoute = require("./UserRoute");
const commonRoute = require("./CommonRoute");
const forumRoute = require("./ForumRouter");

const router = express.Router();

router.use("/projects", projectRoutes);
router.use("/common", commonRoute);
router.use("/user", userRoute);
router.use("/forum", forumRoute);

module.exports = router;
