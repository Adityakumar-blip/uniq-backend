var mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    img: {
      type: String,
    },
    isAgreed: {
      type: Boolean,
    },
    bio: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    github: {
      type: String,
    },
    userId: {
      type: String,
    },
    projects: {
      type: Array,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
