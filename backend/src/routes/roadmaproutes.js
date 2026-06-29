const express = require("express");
const router = express.Router();

const { getRoadmap } = require("../controllers/roadmapcontroller");

const { authenticate } = require("../middleware/authmiddleware");
const authorize = require("../middleware/authorize");

router.get(
  "/:mockInterviewId",
  authenticate,
  authorize("candidate"),
  getRoadmap
);

module.exports = router;