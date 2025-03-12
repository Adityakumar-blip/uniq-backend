const express = require("express");
const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
  getQuestionsByCategoryId,
} = require("../controllers/QuestionController");
const router = express.Router();

router.post("/createQuestion", createQuestion);
router.get("/getAllQuestions", getAllQuestions);
router.get("/getQuestionById", getQuestionById);
router.get("/getQuestionByCategory", getQuestionsByCategoryId);
router.put("/updateQuestion", updateQuestionById);
router.delete("/deleteQuestion", deleteQuestionById);

module.exports = router;
