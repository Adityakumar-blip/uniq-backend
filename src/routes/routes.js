// src/routes/routes.js
const express = require("express");
const projectRoutes = require("./ProjectRoute");
const userRoute = require("./UserRoute");
const commonRoute = require("./CommonRoute");
const forumRoute = require("./ForumRouter");
const questionRoute = require("./QuestionRoute");
const questionCategory = require("./QuestionCategoryRoute");

const router = express.Router();

router.use("/projects", projectRoutes);
router.use("/common", commonRoute);
router.use("/user", userRoute);
router.use("/forum", forumRoute);
router.use("/question", questionRoute);
router.use("/questionCategory", questionCategory);

module.exports = router;
