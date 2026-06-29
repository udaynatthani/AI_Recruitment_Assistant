const express = require("express");

const router = express.Router();

const {
  getRecruiterDashboard,
} = require("../controllers/recruiterDashboardController");

const {
  authenticate,
} = require("../middleware/authmiddleware");

const authorize = require("../middleware/authorize");

router.get(
  "/",
  authenticate,
  authorize("recruiter"),
  getRecruiterDashboard
);

module.exports = router;