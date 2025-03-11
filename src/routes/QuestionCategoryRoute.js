const express = require("express");
const {
  createQuestionCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require("../controllers/QuestionCategory");

const router = express.Router();

router.post("/createCategory", createQuestionCategory);
router.get("/getAllCategories", getAllCategories);
router.get("/getCategoryById", getCategoryById);
router.put("/updateCategory", updateCategoryById);
router.delete("/deleteQuestion", deleteCategoryById);

module.exports = router;
