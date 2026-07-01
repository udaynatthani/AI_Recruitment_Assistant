const pool = require("../config/db");

const generateCoverLetter = require("../services/coverletterservice");

const createCoverLetter = async (req, res) => {

    try {

        const userId = req.user.id;
        console.log("User ID:", userId);

        const { slug } = req.params;

        // Latest Resume Analysis
        const resumeResult = await pool.query(
            `
            SELECT *
            FROM resume_analysis
            WHERE user_id=$1
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [userId]
        );

        if (resumeResult.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Resume analysis not found"
            });

        }

        // Job
        const jobResult = await pool.query(
            `
            SELECT *
            FROM jobs
            WHERE slug=$1
            `,
            [slug]
        );

        if (jobResult.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Job not found"
            });

        }

        const coverLetter = await generateCoverLetter(
            resumeResult.rows[0],
            jobResult.rows[0]
        );

        const saved = await pool.query(
            `
            INSERT INTO cover_letters
            (
                user_id,
                job_id,
                content
            )
            VALUES
            ($1,$2,$3)
            RETURNING *
            `,
            [
                userId,
                jobResult.rows[0].id,
                coverLetter
            ]
        );

        res.status(201).json({

            success: true,

            message: "Cover Letter Generated",

            coverLetter: saved.rows[0]

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    createCoverLetter

};