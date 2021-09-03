const express = require("express");
const Projects = require("./projects-model");
const { validateProjectId, validateProject } = require("./projects-middleware");
const { Router } = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  Projects.get()
    .then((projects) => {
      console.log(projects);
      if (projects) {
        res.status(200).json(projects);
      } else {
        res.status(200).json([]);
      }
    })
    .catch(next);
});

router.get("/:id", validateProjectId, (req, res, next) => {
  res.json(req.project);
});

router.post("/", validateProject, (req, res, next) => {
  Projects.insert(req.body)
    .then((project) => {
      res.status(201).json({
        name: req.body.name,
        description: req.body.description,
        completed: req.body.completed,
      });
    })
    .catch(next);
});

router.put("/:id", validateProjectId, validateProject, (req, res, next) => {
  const { id } = req.params;
  const updatedProject = req.body;

  Projects.update(id, updatedProject)
    .then((project) => {
      res.status(200).json({
        name: project.name,
        description: project.description,
        completed: project.completed,
      });
      next();
    })
    .catch(next);
});

router.delete("/:id", validateProjectId, async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = Projects.get(id);
    await Projects.remove(id);
    res.status(200).json({ project });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/actions", validateProjectId, async (req, res, next) => {
  try {
    const projects = await Projects.getProjectActions(req.params.id);
    if (projects) {
      res.status(200).json(projects);
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    next(err);
  }
});

// eslint-disable-next-line
router.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: "Something bad inside the projects router!",
  });
});

module.exports = router;
