const sendResponse = require("../../utils/responseHandler");
const Category = require("../models/Category");

exports.createQuestionCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const category = new Category({ name, description, isActive });
    await category.save();
    sendResponse(res, 201, category, "Category created successfully");
  } catch (error) {
    sendResponse(res, 400, {}, error.message);
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    sendResponse(res, 200, categories, "Categories retrieved successfully");
  } catch (error) {
    sendResponse(res, 500, {}, error.message);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.query.id);
    if (!category) return sendResponse(res, 404, {}, "Category not found");
    sendResponse(res, 200, category, "Category retrieved successfully");
  } catch (error) {
    sendResponse(res, 500, {}, error.message);
  }
};

exports.updateCategoryById = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.query.id,
      { name, description, isActive },
      { new: true }
    );
    if (!category) return sendResponse(res, 404, {}, "Category not found");
    sendResponse(res, 200, category, "Category updated successfully");
  } catch (error) {
    sendResponse(res, 400, {}, error.message);
  }
};

exports.deleteCategoryById = async () => {
  try {
    const category = await Category.findByIdAndDelete(req.query.id);
    if (!category) return sendResponse(res, 404, {}, "Category not found");
    sendResponse(res, 200, {}, "Category deleted successfully");
  } catch (error) {
    sendResponse(res, 500, {}, error.message);
  }
};
