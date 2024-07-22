const uploadMiddleware = require("../../utils/multerConfig");
const sendResponse = require("../../utils/responseHandler");
const Forum = require("../models/Forum");

exports.addDiscussion = (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      if (req.file == undefined) {
        return res.status(400).json({ error: "No file selected" });
      } else {
        try {
          const newProject = await Forum.create({
            ...req.body,
            img: req.img,
            author: req.user._id,
          });
          return sendResponse(
            res,
            201,
            newProject,
            "Discussion added succesfully"
          );
        } catch (err) {
          sendResponse(res, 400, {}, err.message);
        }
      }
    }
  });
};

exports.getAllDiscussion = async (req, res) => {
  try {
    const forums = await Forum.find().populate("author");
    return sendResponse(res, 200, { data: forums }, "fetched all forums");
  } catch (err) {
    console.error("Error:", err);
    return sendResponse(res, 500, {}, err.message);
  }
};
