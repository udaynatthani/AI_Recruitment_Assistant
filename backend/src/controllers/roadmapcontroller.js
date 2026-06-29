const pool = require("../config/db");
const generateRoadmap = require("../services/roadmapservice");

const getRoadmap = async (req, res) => {
  try {

    const userId = req.user.id;
    const { mockInterviewId } = req.params;


    const interview = await pool.query(
      `
      SELECT *
      FROM mock_interviews
      WHERE id = $1
      AND user_id = $2
      `,
      [mockInterviewId, userId]
    );

    if (interview.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const existingRoadmap = await pool.query(
      `
      SELECT *
      FROM learning_roadmaps
      WHERE mock_interview_id = $1
      `,
      [mockInterviewId]
    );

    if (existingRoadmap.rows.length > 0) {
      return res.status(200).json({
        success: true,
        roadmap: existingRoadmap.rows[0].roadmap,
      });
    }

  
    const report = await pool.query(
      `
      SELECT *
      FROM interview_reports
      WHERE mock_interview_id = $1
      `,
      [mockInterviewId]
    );

    if (report.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    const roadmap = await generateRoadmap(report.rows[0]);


    await pool.query(
      `
      INSERT INTO learning_roadmaps
      (
        user_id,
        mock_interview_id,
        roadmap
      )
      VALUES
      ($1,$2,$3)
      `,
      [
        userId,
        mockInterviewId,
        JSON.stringify(roadmap.roadmap),
      ]
    );

    res.status(200).json({
      success: true,
      roadmap: roadmap.roadmap,
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
  getRoadmap,
};