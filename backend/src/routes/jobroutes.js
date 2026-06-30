const express = require("express");
const router = express.Router();

const {
  createjob,
  getalljob,
  getjobbyid,
  updatejob,
  deletejob,
} = require("../controllers/jobcontroller");

const { authenticate } = require("../middleware/authmiddleware");
const authorize = require("../middleware/authorize");


router.get("/", getalljob);
router.get("/:id", getjobbyid);


router.post(
  "/",
  authenticate,
  authorize("recruiter"),
  createjob
);

router.put(
  "/:slug",
  authenticate,
  authorize("recruiter"),
  updatejob
);

router.delete(
  "/:id",
  authenticate,
  authorize("recruiter"),
  deletejob
);

module.exports = router;