require("dotenv").config();
const cloudinary = require("./src/config/cloudinary");

async function test() {
  try {
    const result = await cloudinary.uploader.upload("./Natthani_Uday_resume_18-06-26.pdf", {
      resource_type: "auto",
      folder: "AI-recruitment-resumes",
    });

   
  } catch (err) {
    console.error("Error uploading file to Cloudinary:", err);
  }
}

test();