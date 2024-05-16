const db = require("../models/User");
const jwt = require("jsonwebtoken");

// ** User Signup Controller
exports.Signup = async (req, res) => {
  try {
    const userRegister = await db.findOne({ email: req.body.email });

    if (!userRegister) {
      const register = new db({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        image: req.body.image,
      });

      const response = await register.save();

      if (response) {
        return res.status(200).json({
          message: "Registration Successfull",
          code: 200,
          data: register,
        });
      }
    } else {
      return res.status(400).json({
        message: "Email is already used , please sign in",
        code: 400,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
      code: 400,
    });
  }
};

// ** User Signin Controller
exports.Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || email.trim() === "" || password.trim() === "") {
      res.status(400).send({
        code: 400,
        message: "Invalid input data. Both email and password are required.",
      });
      return;
    }

    await db.findOne({ email, password }).then((resp) => {
      if (resp) {
        let token = jwt.sign({ email: resp?.email }, "AKPP", {
          algorithm: "HS256",
        });
        res.send({
          code: 200,
          message: "Login Successful",
          token: token,
          data: resp,
        });
      } else {
        res.send({
          code: 400,
          message: "Invalid Credentials",
        });
      }
    });
  } catch (error) {
    res.send({
      code: 400,
      message: "Something went wrong",
    });
  }
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
