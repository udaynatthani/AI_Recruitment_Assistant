const pool = require("../config/db");
const generateInterviewQuestions = require("../services/interviewaiservice");

const createmockinterview = async (req, res) => {
    try {

        const userId = req.user.id;
        const { slug } = req.params;

        
        const jobResult = await pool.query(
            `
            SELECT *
            FROM jobs
            WHERE slug = $1
            `,
            [slug]
        );

        if (jobResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const job = jobResult.rows[0];

        const application = await pool.query(
            `
            SELECT id
            FROM applications
            WHERE candidate_id = $1
            AND job_id = $2
            `,
            [userId, job.id]
        );

        if (application.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You must apply for this job before taking the mock interview.",
            });
        }

       
        const resumeResult = await pool.query(
            `
            SELECT *
            FROM resume_analysis
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [userId]
        );

        if (resumeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Resume analysis not found",
            });
        }

        const existingInterview = await pool.query(
            `
            SELECT *
            FROM mock_interviews
            WHERE user_id = $1
            AND job_id = $2
            `,
            [userId, job.id]
        );

        if (existingInterview.rows.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Mock interview already exists.",
                questions: existingInterview.rows[0].questions,
            });
        }

       
        const questions = await generateInterviewQuestions(
            resumeResult.rows[0],
            job
        );

      
        await pool.query(
            `
            INSERT INTO mock_interviews
            (
                user_id,
                job_id,
                questions
            )
            VALUES
            ($1,$2,$3)
            `,
            [
                userId,
                job.id,
                JSON.stringify(questions.questions),
            ]
        );

        res.status(201).json({
            success: true,
            message: "Mock interview created successfully",
            questions: questions.questions,
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
    createmockinterview,
};