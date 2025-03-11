const { ObjectId } = require("mongodb");
const Project = require("../models/Project");
const User = require("../models/User");
const mongoose = require("mongoose");
const uploadMiddleware = require("../../utils/multerConfig");
const sendResponse = require("../../utils/responseHandler");

exports.addProject = (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      if (req.file == undefined) {
        return res.status(400).json({ error: "No file selected" });
      } else {
        try {
          const newProject = await Project.create({
            ...req.body,
            techstack: JSON.parse(req.body.techstack),
            tags: JSON.parse(req.body.tags),
            img: req.img,
            author: req.user._id,
          });
          return sendResponse(
            res,
            201,
            newProject,
            "Project added succesfully"
          );
        } catch (err) {
          sendResponse(res, 400, {}, err.message);
        }
      }
    }
  });
};

exports.GetProjectById = async (req, res) => {
  try {
    const projectId = req.query._id;
    if (!projectId) {
      return res.status(400).send({ message: "Project ID is required" });
    }

    const projectData = await Project.findById(projectId).populate("author");

    if (!projectData) {
      return res.status(404).send({ message: "Project not found" });
    }

    res
      .status(200)
      .send({ data: projectData, message: "Project fetched successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const { take = 10, search = "", page = 1 } = req.query;

    const limit = parseInt(take, 10);
    const skip = (parseInt(page, 10) - 1) * limit;

    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { "techstack.label": { $regex: search, $options: "i" } },
            { "tags.label": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const projects = await Project.find(searchQuery)
      .populate("author")
      .skip(skip)
      .limit(limit);

    const totalProjects = await Project.countDocuments(searchQuery);

    res.json({
      projects,
      total: totalProjects,
      page: parseInt(page, 10),
      pages: Math.ceil(totalProjects / limit),
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.ContributeToProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
      return res
        .status(400)
        .json({ message: "Project ID and User ID are required" });
    }

    const user = await User.findById(userId).exec();
    const project = await Project.findById(projectId).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isAlreadyContributor = project.contributors.some(
      (contributor) => contributor._id.toString() === userId
    );

    if (isAlreadyContributor) {
      return res
        .status(400)
        .json({ message: "User is already a contributor to this project" });
    }

    const isProjectInUser = user.projects.some(
      (proj) => proj._id.toString() === projectId
    );

    if (isProjectInUser) {
      return res
        .status(400)
        .json({ message: "Project is already in the user's project list" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { projects: { projectId, isCommited: false } },
      },
      { new: true }
    );

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { contributors: { user: userId, isCommited: false } } },
      { new: true }
    );

    res.status(200).json({
      message: "Contribution Started Successfully",
      project: updatedProject,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while contributing to the project" });
  }
};

exports.getProjectsByAuthor = async (req, res) => {
  try {
    const { authorId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return sendResponse(res, 400, {}, "Invalid author ID");
    }

    const projectByAuthor = await Project.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(authorId),
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

    if (projectByAuthor.length === 0) {
      return sendResponse(res, 404, {}, "No projects found for this author");
    }

    return sendResponse(
      res,
      200,
      projectByAuthor,
      "Fetched projects successfully"
    );
  } catch (err) {
    console.error("Error:", err);
    return sendResponse(res, 500, {}, err.message);
  }
};
