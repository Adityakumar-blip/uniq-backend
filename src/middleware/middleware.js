const jwt = require("jsonwebtoken");
const db = require("../models/User");
require("dotenv").config();

const authorize = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.findOne({ email: decoded.email, token: token });

    console.log("user", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid token." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authorize;
