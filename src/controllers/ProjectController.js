const { ObjectId } = require("mongodb");
const upload = require("../../utils/multerConfig");
const Project = require("../models/Project");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.addProject = (req, res) => {
  upload(req, res, async (err) => {
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
            img: `/uploads/${req.file.filename}`,
            author: req.user._id,
          });
          res.status(201).json(newProject);
        } catch (err) {
          res.status(400).json({ error: err.message });
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

    const aggregation = [
      {
        $match: { _id: ObjectId(projectId.toString()) },
      },
      {
        $unwind: {
          path: "$contributors",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "contributors.user": {
            $toObjectId: "$contributors.user",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "contributors.user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "contributors.fullName": "$userData.fullName",
          "contributors.img": "$userData.img",
        },
      },
      {
        $project: {
          userData: 0,
        },
      },
      {
        $group: {
          _id: "$_id",
          contributors: { $push: "$contributors" },
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$doc", { contributors: "$contributors" }],
          },
        },
      },
      {
        $sort: {
          updatedAt: 1,
        },
      },
    ];

    const projectData = await Project.aggregate(aggregation);

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
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
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
