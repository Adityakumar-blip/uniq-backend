const express = require("express");
const forumController = require("../controllers/ForumController");
const authorize = require("../middleware/middleware");

const router = express.Router();

// Post apis
router.post("/addDiscussion", authorize, forumController.addDiscussion);
router.post("/addCategory", authorize, forumController.addCategory);
router.post("/addComment", authorize, forumController.addCommentToDiscussion);

// Get apis
router.get("/getAllCategory", authorize, forumController.getAllCategory);
router.get("/getAllDiscussion", forumController.getAllDiscussion);
router.get("/getCommentsByForum", forumController.getCommentsByForum);

module.exports = router;
