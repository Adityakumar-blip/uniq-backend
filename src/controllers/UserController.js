const upload = require("../../utils/multerConfig");
const db = require("../models/User");
const jwt = require("jsonwebtoken");

// ** User Signup Controller
exports.Signup = async (req, res) => {
  try {
    const userRegister = await db.findOne({ email: req.body.email });

    if (!userRegister) {
      let token = jwt.sign({ email: req?.email }, "AKPP", {
        algorithm: "HS256",
      });
      const register = new db({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        image: req.body.image,
      });

      const response = await register.save();

      console.log("Register", response);

      if (response) {
        const userResponse = {
          fullName: response.fullName,
          email: response.email,
          image: response.image,
          _id: response._id,
          token: token,
        };

        return res.status(200).json({
          message: "Registration Successfull",
          code: 200,
          data: userResponse,
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

// ** Update users
exports.UpdateUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "File upload error" });
    }

    try {
      console.log(req.body);
      if (!req.body._id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      console.log("File", req.file);

      const updateData = { ...req.body };
      if (req.file) {
        updateData.img = `/uploads/${req.file.filename}`;
      }

      console.log("updated", updateData);

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
