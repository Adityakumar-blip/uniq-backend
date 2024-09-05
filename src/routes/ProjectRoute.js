const express = require("express");
const projectController = require("../controllers/ProjectController");
const { authorize } = require("../middleware/middleware");

const router = express.Router();

router.post("/addProject", authorize, projectController.addProject);
router.get("/getAllProject", projectController.getAllProjects);
router.get("/getProjectById", projectController.GetProjectById);
router.post("/contribute", authorize, projectController.ContributeToProject);
router.get(
  "/getProjectByAuthor",
  authorize,
  projectController.getProjectsByAuthor
);

module.exports = router;
