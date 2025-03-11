const sendResponse = require("../../utils/responseHandler");
const Question = require("../models/Question");

exports.createQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    sendResponse(res, 201, question, "Question created successfully");
  } catch (error) {
    sendResponse(res, 400, {}, error.message);
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("category", "name");
    sendResponse(res, 200, questions, "Questions retrieved successfully");
  } catch (error) {
    sendResponse(res, 500, {}, error.message);
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!question) return sendResponse(res, 404, {}, "Question not found");
    sendResponse(res, 200, question, "Question retrieved successfully");
  } catch (error) {
    sendResponse(res, 500, {}, error.message);
  }
};

exports.updateQuestionById = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!question) return sendResponse(res, 404, {}, "Question not found");
    sendResponse(res, 200, question, "Question updated successfully");
  } catch (error) {
    sendResponse(res, 400, {}, error.message);
  }
};

exports.deleteQuestionById = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return sendResponse(res, 404, {}, "Question not found");
    sendResponse(res, 200, {}, "Question deleted successfully");
  } catch (error) {
    sendResponse(res, 500, {}, error.message);
  }
};
