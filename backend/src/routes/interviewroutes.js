const express = require("express");

const router = express.Router();

const {
    scheduleInterview,
    getMyInterviews,
    getrecruiterinterviews,
    updateinterviewstatus,

} = require("../controllers/interviewcontoller");

const { authenticate } = require("../middleware/authmiddleware");

const authorize = require("../middleware/authorize");

router.post(
    "/:slug",
    authenticate,
    authorize("recruiter"),
    scheduleInterview
);
router.get(
    "/my",
    authenticate,
    authorize("candidate"),
    getMyInterviews
);

router.get(
    "/recruiter",
    authenticate,
    authorize("recruiter"),
    getrecruiterinterviews
);

router.put(
    "/:id",
    authenticate,
    authorize("recruiter"),
    updateinterviewstatus
);

module.exports = router;