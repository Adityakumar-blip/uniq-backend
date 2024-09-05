const express = require("express");
const UserController = require("../controllers/UserController");
const { authorize, isAdmin } = require("../middleware/middleware");

const router = express.Router();

router.post("/signup", UserController.Signup);
router.post("/signin", UserController.Signin);
router.post("/updateUser", UserController.UpdateUser);
router.post("/createUser", authorize, isAdmin, UserController.CreateAdminUser);
router.post("/getAllUsers", authorize, UserController.GetAllUser);

module.exports = router;
