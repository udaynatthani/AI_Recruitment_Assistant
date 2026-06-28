const express = require("express");
const router = express.Router();

const { uploadresume } = require("../controllers/resumecontroller");
const { authenticate } = require("../middleware/authmiddleware");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/upload");

router.post(
  "/upload",
  authenticate,
  authorize("candidate"),

  (req, res, next) => {
  

    upload.single("resume")(req, res, (err) => {
      if (err) {
       
        return res.status(500).json({
          success: false,
          message: err.message,
          error: err,
        });
      }

    

      next();
    });
  },

  uploadresume
);

module.exports = router;