const express = require("express");

const router = express.Router();

const {
    createmockinterview,
}= require("../controllers/interviewaicontroller");

const {authenticate}= require("../middleware/authmiddleware");

const authorize = require("../middleware/authorize");

router.post(
    "/:slug",
    authenticate,
    authorize("candidate"),
    createmockinterview
);

module.exports = router;