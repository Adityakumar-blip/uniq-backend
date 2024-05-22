const { ObjectId } = require("mongodb");
const upload = require("../../utils/multerConfig");
const Project = require("../models/Project");

exports.addProject = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      if (req.file == undefined) {
        return res.status(400).json({ error: "No file selected" });
      } else {
        try {
          const { title, description } = req.body;
          const newProject = await Project.create({
            ...req.body,
            img: `/uploads/${req.file.filename}`,
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
    console.log(req);
    const projectId = req.body._id;
    const projectData = await Project.db
      .collection("projects")
      .findOne({ _id: projectId });

    console.log(projectData);

    if (!projectData) {
      return res.status(404).send({ message: "Project not found" });
    }

    console.log("project", projectData);
    res.status(200).send(projectData);
  } catch (error) {
    console.log("error", error);
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
