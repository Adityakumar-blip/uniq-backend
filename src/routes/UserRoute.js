const express = require("express");
const UserController = require("../controllers/UserController");

const router = express.Router();

router.post("/signup", UserController.Signup);
router.post("/signin", UserController.Signin);
router.post("/updateUser", UserController.UpdateUser);

module.exports = router;
