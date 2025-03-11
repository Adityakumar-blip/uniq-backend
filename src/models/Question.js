const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true, // Main explanation
  },
  codeSnippet: {
    type: String, // Optional code block (if applicable)
  },
  references: [
    {
      source: String, // URL or book/article reference
    },
  ],
});

const QuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["React", "Node.js", "JavaScript", "CSS"], // Extend as needed
    },
    questionText: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate questions
    },
    answers: {
      type: [AnswerSchema], // Supports multiple answers
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Theoretical", "Practical"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    frequency: {
      type: Number,
      required: true,
      min: 1,
      max: 10, // Frequency rating from 1 to 10
    },
    tags: {
      type: [String], // Extra tags (e.g., "hooks", "state management")
      default: [],
    },
    relatedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question", // Link to related questions
      },
    ],
    author: {
      type: String, // Can store contributor’s name or ID
      default: "Admin",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Question", QuestionSchema);
