const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  codeSnippet: {
    type: String,
  },
  references: [
    {
      source: String,
    },
  ],
});

const QuestionSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionCategory",
    },
    question: {
      type: String,
      required: true,
    },
    answers: {
      type: [AnswerSchema],
      required: true,
    },
    description: {
      type: String,
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
      max: 10,
    },
    tags: {
      type: [String],
      default: [],
    },
    relatedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    author: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", QuestionSchema);
