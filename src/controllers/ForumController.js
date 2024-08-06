const { default: mongoose } = require("mongoose");
const uploadMiddleware = require("../../utils/multerConfig");
const sendResponse = require("../../utils/responseHandler");
const Comment = require("../models/Comment");
const Forum = require("../models/Forum");
const ForumCategory = require("../models/ForumCategory");

const updateCategory = async (categoryId, updateDetails) => {
  try {
    const updatedCategory = await ForumCategory.findOneAndUpdate(
      { _id: categoryId },
      updateDetails,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      throw new Error("Category not found");
    }

    return updatedCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

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
        category: req?.body?.category.value,
        author: req.user._id,
      };

      const newDiscussion = await Forum.create(discussionData);
      const allDiscussions = await (
        await Forum.find({ category: req.body.category.value })
      ).length;
      await updateCategory(req.body.category.value, {
        discussions: allDiscussions,
        comments: 10,
      });
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
    const commentId = req.body.commentId;

    if (commentId) {
      await Comment.findByIdAndUpdate(
        commentId,
        { $push: { replies: newComment._id } },
        { new: true }
      );
    } else {
      await Forum.findByIdAndUpdate(
        forumId,
        { $push: { comments: newComment._id } },
        { new: true }
      );
    }
    return sendResponse(res, 201, newComment, "Comment added successfully");
  } catch (err) {
    sendResponse(res, 400, {}, err.message);
  }
};

exports.getCommentsByForum = async (req, res) => {
  try {
    const { forumId } = req.query;

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

exports.getDiscussionById = async (req, res) => {
  try {
    const { forumId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(forumId)) {
      return sendResponse(res, 400, {}, "Invalid forum ID");
    }

    const Forumbyid = await Forum.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(forumId),
        },
      },
      {
        $lookup: {
          from: "categories",
          foreignField: "_id",
          localField: "category",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
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

    if (Forumbyid.length === 0) {
      return sendResponse(res, 404, {}, "Forum not found");
    }

    return sendResponse(res, 200, Forumbyid[0], "Fetched forum successfully");
  } catch (err) {
    console.error("Error:", err);
    return sendResponse(res, 500, {}, err.message);
  }
};

exports.getRepliesById = async (req, res) => {
  try {
    const { commentId } = req.query;

    const replies = await Comment.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(commentId),
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { replyIds: "$replies" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$replyIds"],
                },
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
          ],
          as: "repliesData",
        },
      },
      {
        $project: {
          _id: 0,
          repliesData: 1,
        },
      },
    ]);

    return sendResponse(
      res,
      200,
      replies.length > 0 ? replies[0].repliesData : [],
      "Fetched all replies"
    );
  } catch (err) {
    console.error("Error:", err);
    return sendResponse(res, 500, {}, err.message);
  }
};

exports.addForumUpvote = async (req, res) => {
  try {
    const { forumId } = req.body;

    if (!forumId) {
      return sendResponse(res, 500, {}, "Forum Id is required");
    }

    const upvote = await Forum.findByIdAndUpdate(
      forumId,
      { $addToSet: { upvotes: req.user._id } },
      { new: true }
    );
    return sendResponse(res, 201, upvote, "upvote added successfully");
  } catch (error) {
    return sendResponse(res, 500, {}, error.message);
  }
};

exports.addForumDownvote = async (req, res) => {
  try {
    const { forumId } = req.body;

    if (!forumId) {
      return sendResponse(res, 500, {}, "Forum Id is required");
    }

    const upvote = await Forum.findByIdAndUpdate(
      forumId,
      { $addToSet: { downvotes: req.user._id } },
      { new: true }
    );
    return sendResponse(res, 201, upvote, "downvote added successfully");
  } catch (error) {
    return sendResponse(res, 500, {}, error.message);
  }
};

exports.getDiscussionsByAuthorId = async (req, res) => {
  try {
    const { authorId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return sendResponse(res, 400, {}, "Invalid author ID");
    }

    const forumsByAuthor = await Forum.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(authorId),
        },
      },
      {
        $lookup: {
          from: "categories",
          foreignField: "_id",
          localField: "category",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
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

    if (forumsByAuthor.length === 0) {
      return sendResponse(res, 404, {}, "No forums found for this author");
    }

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const segregatedForums = forumsByAuthor.reduce((acc, forum) => {
      const createdAt = new Date(forum.createdAt);
      const year = createdAt.getFullYear();
      const month = monthNames[createdAt.getMonth()];

      if (!acc[year]) {
        acc[year] = {};
      }

      if (!acc[year][month]) {
        acc[year][month] = [];
      }

      acc[year][month].push(forum);

      return acc;
    }, {});

    // Get current year and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = monthNames[currentDate.getMonth()];

    // Create a sorted object with the current month on top
    const sortedForums = {
      [currentYear]: {
        [currentMonth]: segregatedForums[currentYear]?.[currentMonth] || [],
        ...segregatedForums[currentYear],
      },
      ...Object.keys(segregatedForums)
        .filter((year) => year != currentYear)
        .sort((a, b) => b - a)
        .reduce((acc, year) => {
          acc[year] = segregatedForums[year];
          return acc;
        }, {}),
    };

    return sendResponse(res, 200, sortedForums, "Fetched forums successfully");
  } catch (err) {
    console.error("Error:", err);
    return sendResponse(res, 500, {}, err.message);
  }
};

exports.getDiscussionsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return sendResponse(res, 400, {}, "Invalid forum ID");
    }

    const Forumbyid = await Forum.aggregate([
      {
        $match: {
          category: new mongoose.Types.ObjectId(categoryId),
        },
      },
      {
        $lookup: {
          from: "categories",
          foreignField: "_id",
          localField: "category",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
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

    if (Forumbyid.length === 0) {
      return sendResponse(res, 404, {}, "Forum not found");
    }

    return sendResponse(res, 200, Forumbyid, "Fetched forum successfully");
  } catch (err) {
    console.error("Error:", err);
    return sendResponse(res, 500, {}, err.message);
  }
};
