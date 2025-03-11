const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate categories
      trim: true,
    },
    description: {
      type: String, // Optional description of the category
    },
    isActive: {
      type: Boolean,
      default: true, // To enable/disable categories dynamically
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("QuestionCategory", CategorySchema);
