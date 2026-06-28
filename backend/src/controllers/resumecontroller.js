const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const parseResume = require("../services/resumeparse");
// const cloudinaryResult = await uploadStream();
const analyzeResume = require("../services/geminiservice");

const uploadresume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    // const cloudinaryResult = await uploadStream();

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "AI-recruitment-resumes",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
                return reject(error);
            }
        
         
        
            resolve(result);
        }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const cloudinaryResult = await uploadStream();
    const parsedResume = await parseResume(req.file.buffer);
    if (!parsedResume.success) {
        return res.status(400).json({
          success: false,
          message: parsedResume.message,
        });
      }
      

// console.log(parsedResume.text);

    const resumeUrl = cloudinaryResult.secure_url;
  
    const analysis = await analyzeResume(parsedResume.text);

    // console.log(analysis);
    

    const userId = req.user.id;

    const result = await pool.query(
      `
      UPDATE users
      SET resume_url = $1
      WHERE id = $2
      RETURNING id,name,email,role,resume_url
      `,
      [resumeUrl, userId]
    );

    await pool.query(
        `
        INSERT INTO resume_analysis
        (
        user_id,
        skills,
        projects,
        experience,
        education,
        certifications,
        summary
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
        userId,
        JSON.stringify(analysis.skills),
        JSON.stringify(analysis.projects),
        JSON.stringify(analysis.experience),
        JSON.stringify(analysis.education),
        JSON.stringify(analysis.certifications),
        analysis.summary
        ]
        );

        res.status(200).json({
            success: true,
            message: "Resume uploaded and analyzed successfully",
            resume: resumeUrl,
            analysis
        });
  } catch (error) {
 console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  uploadresume,
};