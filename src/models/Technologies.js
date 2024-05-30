const mongoose = require("mongoose");

const techSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Tech = mongoose.model("Technologies", techSchema);

module.exports = Tech;
