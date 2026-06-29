const pool = require("../config/db");

const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const [
      jobsResult,
      applicationsResult,
      interviewsResult,
      averageMatchResult,
      jobStatsResult,
      interviewStatusResult,
      applicationStatusResult,
      topSkillsResult,
    ] = await Promise.all([
      // Total Jobs
      pool.query(
        `
        SELECT COUNT(*) AS total_jobs
        FROM jobs
        WHERE recruiter_id = $1
        `,
        [recruiterId]
      ),

      // Total Applications
      pool.query(
        `
        SELECT COUNT(*) AS total_applications
        FROM applications a
        JOIN jobs j
        ON a.job_id = j.id
        WHERE j.recruiter_id = $1
        `,
        [recruiterId]
      ),

      // Total Interviews
      pool.query(
        `
        SELECT COUNT(*) AS total_interviews
        FROM interviews
        WHERE recruiter_id = $1
        `,
        [recruiterId]
      ),

      // Average ATS Score
      pool.query(
        `
        SELECT ROUND(AVG(ai_match_score),2) AS average_match_score
        FROM applications a
        JOIN jobs j
        ON a.job_id = j.id
        WHERE j.recruiter_id = $1
        `,
        [recruiterId]
      ),

      // Applications Per Job
      pool.query(
        `
        SELECT
            j.id,
            j.title,
            COUNT(a.id) AS applications
        FROM jobs j
        LEFT JOIN applications a
        ON j.id = a.job_id
        WHERE j.recruiter_id = $1
        GROUP BY j.id
        ORDER BY applications DESC
        `,
        [recruiterId]
      ),

      // Interview Status
      pool.query(
        `
        SELECT
            status,
            COUNT(*) AS total
        FROM interviews
        WHERE recruiter_id = $1
        GROUP BY status
        `,
        [recruiterId]
      ),

      // Application Status
      pool.query(
        `
        SELECT
            a.status,
            COUNT(*) AS total
        FROM applications a
        JOIN jobs j
        ON a.job_id = j.id
        WHERE j.recruiter_id = $1
        GROUP BY a.status
        `,
        [recruiterId]
      ),

      // Top Skills
      pool.query(
        `
        SELECT
            skill,
            COUNT(*) AS total
        FROM (
            SELECT
            jsonb_array_elements_text(skills) AS skill
            FROM resume_analysis
        ) s
        GROUP BY skill
        ORDER BY total DESC
        LIMIT 10
        `
      ),
    ]);

    res.status(200).json({
      success: true,

      summary: {
        totalJobs: Number(jobsResult.rows[0].total_jobs),
        totalApplications: Number(
          applicationsResult.rows[0].total_applications
        ),
        totalInterviews: Number(
          interviewsResult.rows[0].total_interviews
        ),
        averageMatchScore:
          averageMatchResult.rows[0].average_match_score || 0,
      },

      jobStats: jobStatsResult.rows,

      interviewStats: interviewStatusResult.rows,

      applicationStatus: applicationStatusResult.rows,

      topSkills: topSkillsResult.rows,
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
  getRecruiterDashboard,
};