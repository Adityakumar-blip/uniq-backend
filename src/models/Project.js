const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortIntro: {
      type: String,
      required: true,
    },
    techstack: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    img: {
      type: String,
    },
    contributors: {
      type: Array,
    },
    commits: {
      type: Array,
    },
    links: {
      type: Array,
    },
    request: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    user: {
      type: Object,
    },
    status: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
