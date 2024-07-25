const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    forumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Forum",
      required: true,
    },
    text: { type: String, required: true },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    isReplied: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
