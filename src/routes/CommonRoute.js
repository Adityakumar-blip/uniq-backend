const express = require("express");
const commonController = require("../controllers/CommonController");
const authorize = require("../middleware/middleware");

const router = express.Router();

router.post("/addCommon", commonController.addCommon);
router.get("/getAllCommon", commonController.getAllCommon);

module.exports = router;
