const mongoose = require("mongoose");

const CategroySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    discussions: { type: Number },
    comments: { type: Number },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategroySchema);
