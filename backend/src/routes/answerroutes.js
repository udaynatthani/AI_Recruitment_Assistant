const express= require("express");
const router= express.Router();

const {submitAnswer} = require("../controllers/answercontroller");
const{authenticate}= require("../middleware/authmiddleware");
const authorize= require("../middleware/authorize");

router.post(
    "/:mockinterviewid",
    authenticate,
    authorize("candidate"),
    submitAnswer
);

module.exports= router;