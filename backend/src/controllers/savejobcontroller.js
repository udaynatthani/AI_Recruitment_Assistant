const pool = require("../config/db");

const saveJob = async (req, res) => {

    try {

        const candidateId = req.user.id;

        const { slug } = req.params;

        // Find Job
        const job = await pool.query(
            `
            SELECT id
            FROM jobs
            WHERE slug = $1
            `,
            [slug]
        );

        if (job.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Job not found"
            });

        }

        const jobId = job.rows[0].id;

        // Already Saved?
        const existing = await pool.query(
            `
            SELECT id
            FROM saved_jobs
            WHERE candidate_id=$1
            AND job_id=$2
            `,
            [candidateId, jobId]
        );

        if (existing.rows.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Job already saved"
            });

        }

        const result = await pool.query(
            `
            INSERT INTO saved_jobs
            (
                candidate_id,
                job_id
            )
            VALUES
            ($1,$2)
            RETURNING *
            `,
            [candidateId, jobId]
        );

        res.status(201).json({

            success: true,

            message: "Job saved successfully",

            savedJob: result.rows[0]

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
const getSavedJobs = async (req, res) => {

    try {

        const candidateId = req.user.id;

        const result = await pool.query(
            `
            SELECT

            saved_jobs.id,

            saved_jobs.created_at,

            jobs.slug,

            jobs.title,

            jobs.company_name,

            jobs.location,

            jobs.salary,

            jobs.job_type,

            jobs.experience

            FROM saved_jobs

            JOIN jobs

            ON saved_jobs.job_id = jobs.id

            WHERE saved_jobs.candidate_id=$1

            ORDER BY saved_jobs.created_at DESC
            `,
            [candidateId]
        );

        res.json({

            success: true,

            jobs: result.rows

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
const removeSavedJob = async (req, res) => {

    try {

        const candidateId = req.user.id;

        const { slug } = req.params;

        const job = await pool.query(
            `
            SELECT id
            FROM jobs
            WHERE slug=$1
            `,
            [slug]
        );

        if (job.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Job not found"

            });

        }

        const result = await pool.query(
            `
            DELETE FROM saved_jobs

            WHERE candidate_id=$1

            AND job_id=$2

            RETURNING *
            `,
            [
                candidateId,
                job.rows[0].id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Saved job not found"

            });

        }

        res.json({

            success: true,

            message: "Saved job removed"

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

    saveJob,

    getSavedJobs,

    removeSavedJob

};
