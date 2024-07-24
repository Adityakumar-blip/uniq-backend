const express = require("express");
const forumController = require("../controllers/ForumController");
const authorize = require("../middleware/middleware");

const router = express.Router();

router.post("/addDiscussion", authorize, forumController.addDiscussion);
router.post("/addCategory", authorize, forumController.addCategory);
router.get("/getAllCategory", authorize, forumController.getAllCategory);
router.get("/getAllDiscussion", forumController.getAllDiscussion);

module.exports = router;
