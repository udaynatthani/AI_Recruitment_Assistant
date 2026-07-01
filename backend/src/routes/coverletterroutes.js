const express = require("express");

const router = express.Router();

const {

    createCoverLetter

} = require("../controllers/coverlettercontroller");

const { authenticate } = require("../middleware/authmiddleware");

const authorize = require("../middleware/authorize");

router.post(
    "/:slug",
    authenticate,
    authorize("candidate"),
    createCoverLetter
);

module.exports = router;