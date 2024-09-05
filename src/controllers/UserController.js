const db = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const uploadMiddleware = require("../../utils/multerConfig");
require("dotenv").config();

// ** User Signup Controller
exports.Signup = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userRegister = await db.findOne({ email: req.body.email });

      if (!userRegister) {
        const hashedPassword = await bcrypt.hash(
          req.body.password,
          parseInt(process.env.BCRYPT_SALT_ROUNDS)
        );
        let token = jwt.sign(
          { email: req.body.email },
          process.env.JWT_SECRET,
          {
            algorithm: "HS256",
            expiresIn: process.env.JWT_EXPIRATION,
          }
        );
        const register = new db({
          fullName: req.body.fullName,
          email: req.body.email,
          password: hashedPassword,
          image: req.body.image,
          token: token,
          role: "user",
        });

        const response = await register.save();

        if (response) {
          const userResponse = {
            fullName: response.fullName,
            email: response.email,
            _id: response._id,
            token: token,
          };

          return res.status(200).json({
            message: "Registration Successful",
            code: 200,
            data: userResponse,
          });
        }
      } else {
        return res.status(400).json({
          message: "Email is already used, please sign in",
          code: 400,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        code: 500,
      });
    }
  },
];

// ** User Signin Controller
exports.Signin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await db.findOne({ email });
      if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
          let token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: process.env.JWT_EXPIRATION,
          });
          user.token = token;
          await user.save();

          res.send({
            code: 200,
            message: "Login Successful",
            token: token,
            data: user,
          });
        } else {
          res.status(400).json({
            code: 400,
            message: "Invalid Credentials",
          });
        }
      } else {
        res.status(400).json({
          code: 400,
          message: "Invalid Credentials",
        });
      }
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: "Something went wrong",
      });
    }
  },
];

// ** Update users
exports.UpdateUser = async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "File upload error" });
    }

    try {
      if (!req.body._id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const updateData = { ...req.body };
      if (req.img) {
        updateData.img = req.img;
      }

      const updatedUser = await db.findByIdAndUpdate(req.body._id, updateData, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res
        .status(200)
        .json({ message: "User updated successfully", data: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

// ** Get All User Controller
exports.GetAllUser = async (req, res) => {
  try {
    const allUser = await db.find({});

    if (allUser) {
      return res.status(200).json({
        message: "User fetched successfully",
        code: 200,
        data: allUser,
      });
    } else {
      res.status(400).json({
        message: "User not found",
        code: 400,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      code: 400,
    });
  }
};

exports.CreateAdminUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (role === "admin" && req.user.role !== "superadmin") {
    return res
      .status(403)
      .json({ message: "Only super admins can create admin users" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || "admin",
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};
