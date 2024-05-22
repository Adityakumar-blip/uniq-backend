const express = require("express");
const projectController = require("../controllers/ProjectController");

const router = express.Router();

router.post("/addProject", projectController.addProject);
router.get("/getAllProject", projectController.getAllProjects);
router.post("/getProjectById", projectController.GetProjectById);

module.exports = router;
