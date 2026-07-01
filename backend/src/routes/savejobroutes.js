const express = require("express");
const router = express.Router();

const {
    saveJob,
    getSavedJobs,
    removeSavedJob
} = require("../controllers/savejobcontroller");

const { authenticate } = require("../middleware/authmiddleware");
const authorize = require("../middleware/authorize");


router.post(
    "/:slug",
    authenticate,
    authorize("candidate"),
    saveJob
);

// Get Saved Jobs
router.get(
    "/",
    authenticate,
    authorize("candidate"),
    getSavedJobs
);

// Remove Saved Job
router.delete(
    "/:slug",
    authenticate,
    authorize("candidate"),
    removeSavedJob
);

module.exports = router;