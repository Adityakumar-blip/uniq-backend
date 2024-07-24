const { default: mongoose } = require("mongoose");
const uploadMiddleware = require("../../utils/multerConfig");
const sendResponse = require("../../utils/responseHandler");
const Comment = require("../models/Comment");
const Forum = require("../models/Forum");
const ForumCategory = require("../models/ForumCategory");

exports.addDiscussion = async (req, res) => {
  if (req.body.image) {
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      } else {
        try {
          const discussionData = {
            ...req.body,
            author: req.user._id,
            image: req.file ? req.file.path : undefined,
          };

          const newDiscussion = await Forum.create(discussionData);
          return sendResponse(
            res,
            201,
            newDiscussion,
            "Discussion added successfully"
          );
        } catch (err) {
          return sendResponse(res, 400, {}, err.message);
        }
      }
    });
  } else {
    try {
      const discussionData = {
        ...req.body,
        author: req.user._id,
      };

      const newDiscussion = await Forum.create(discussionData);
      return sendResponse(
        res,
        201,
        newDiscussion,
        "Discussion added successfully"
      );
    } catch (err) {
      return sendResponse(res, 400, {}, err.message);
    }
  }
};

exports.addCategory = async (req, res) => {
  try {
    const newProject = await ForumCategory.create({
      ...req.body,
      author: req.user._id,
    });
    return sendResponse(res, 201, newProject, "category added succesfully");
  } catch (err) {
    sendResponse(res, 400, {}, err.message);
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await ForumCategory.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorData",
        },
      },
      {
        $unwind: "$authorData",
      },
      {
        $addFields: {
          author: {
            _id: "$authorData._id",
            fullName: "$authorData.fullName",
            img: "$authorData.img",
          },
        },
      },
      {
        $unset: "authorData",
      },
    ]);

    return sendResponse(res, 200, categories, "Fetched all categories");
  } catch (err) {
    console.error("Error:", err);
    return sendResponse(res, 500, {}, err.message);
  }
};

exports.getAllDiscussion = async (req, res) => {
  try {
    const forums = await Forum.aggregate([
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "author",
          as: "authorData",
        },
      },
      {
        $unwind: "$authorData",
      },
      {
        $addFields: {
          author: {
            _id: "$authorData._id",
            fullName: "$authorData.fullName",
            img: "$authorData.img",
          },
        },
      },
      {
        $unset: "authorData",
      },
    ]);
    return sendResponse(res, 200, forums, "fetched all forums");
  } catch (err) {
    console.error("Error:", err);
    return sendResponse(res, 500, {}, err.message);
  }
};

exports.addCommentToDiscussion = async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      author: req.user._id,
    });

    const forumId = req.body.forumId;

    await Forum.findByIdAndUpdate(
      forumId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    return sendResponse(res, 201, newComment, "Comment added successfully");
  } catch (err) {
    sendResponse(res, 400, {}, err.message);
  }
};

exports.getCommentsByForum = async (req, res) => {
  try {
    const { forumId } = req.query;
    console.log(forumId);

    const comments = await Comment.aggregate([
      {
        $match: {
          forumId: new mongoose.Types.ObjectId(forumId),
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "author",
          as: "authorData",
        },
      },
      {
        $unwind: "$authorData",
      },
      {
        $addFields: {
          author: {
            _id: "$authorData._id",
            fullName: "$authorData.fullName",
            img: "$authorData.img",
          },
        },
      },
      {
        $unset: "authorData",
      },
    ]);

    return sendResponse(res, 200, comments, "Fetched all comments");
  } catch (err) {
    console.error("Error:", err);
    return sendResponse(res, 500, {}, err.message);
  }
};
