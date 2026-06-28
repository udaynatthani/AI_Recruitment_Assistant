const express = require("express");
const router = express.Router();

const{
    applyjob,
    getmyapplications,
    getapplicationsbyjob
}= require("../controllers/applicationcontroller");

const { authenticate } = require("../middleware/authmiddleware");
const authorize = require("../middleware/authorize");


router.post(
  "/",
  authenticate,
  authorize("candidate"),
  applyjob
);

router.get(
  "/my",
  authenticate,
  authorize("candidate"),
  getmyapplications
);


router.get(
  "/job/:jobId",
  authenticate,
  authorize("recruiter"),
  getapplicationsbyjob
);

module.exports = router;