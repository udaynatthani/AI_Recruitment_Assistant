const express = require("express");
const router = express.Router();

const { analyzeCandidate } = require("../controllers/atscontroller");

const { authenticate } = require("../middleware/authmiddleware");
const authorize = require("../middleware/authorize");

router.post(
  "/analyze/:jobId",
  authenticate,
  authorize("candidate"),
  analyzeCandidate
);

module.exports = router;