const express = require("express");
const router = express.Router();

const {
    getinterviewreport,
} = require("../controllers/reportcontroller");

const { authenticate } = require("../middleware/authmiddleware");
const authorize = require("../middleware/authorize");

router.get(
  "/:mockintervieId",
  authenticate,
  authorize("candidate"),
  getinterviewreport);

module.exports = router;