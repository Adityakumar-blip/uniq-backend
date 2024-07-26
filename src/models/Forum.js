const mongoose = require("mongoose");

const ForumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    share: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: [String],
    image: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Forum", ForumSchema);
