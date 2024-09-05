const express = require("express");
const forumController = require("../controllers/ForumController");
const { authorize } = require("../middleware/middleware");

const router = express.Router();

// Post apis
router.post("/addDiscussion", authorize, forumController.addDiscussion);
router.post("/addCategory", authorize, forumController.addCategory);
router.post("/addComment", authorize, forumController.addCommentToDiscussion);
router.post("/addUpvote", authorize, forumController.addForumUpvote);
router.post("/addDownvote", authorize, forumController.addForumDownvote);

// Get apis
router.get("/getAllCategory", authorize, forumController.getAllCategory);
router.get("/getAllDiscussion", forumController.getAllDiscussion);
router.get("/getCommentsByForum", forumController.getCommentsByForum);
router.get("/getDiscussionById", forumController.getDiscussionById);
router.get("/getDiscussionByAuthor", forumController.getDiscussionsByAuthorId);
router.get("/getRepliesById", forumController.getRepliesById);
router.get(
  "/getDiscussionByCategory",
  forumController.getDiscussionsByCategory
);

module.exports = router;
