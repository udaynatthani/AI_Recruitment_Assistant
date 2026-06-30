const pool = require("../config/db");

const applyjob = async (req, res) => {
    try {

        const candidate_id = req.user.id;
        const { slug } = req.params;

        // Find job using slug
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
                message: "Job not found",
            });
        }

        const job_id = job.rows[0].id;

        // Check if already applied
        const alreadyApplied = await pool.query(
            `
            SELECT *
            FROM applications
            WHERE candidate_id = $1
            AND job_id = $2
            `,
            [candidate_id, job_id]
        );

        if (alreadyApplied.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job",
            });
        }

        // Apply
        const result = await pool.query(
            `
            INSERT INTO applications
            (
                candidate_id,
                job_id
            )
            VALUES
            ($1,$2)
            RETURNING *
            `,
            [candidate_id, job_id]
        );

        res.status(201).json({
            success: true,
            message: "Job application submitted successfully",
            application: result.rows[0],
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server failed",
        });

    }
};
    
const getmyapplications = async (req,res)=>{
    try{
        const candidate_id = req.user.id;
        const result = await pool.query(
            ` SELECT
            applications.id,
            applications.status,
            applications.applied_at,
      
            jobs.title,
            jobs.company_name,
            jobs.location
      
            FROM applications
      
            JOIN jobs
            ON applications.job_id = jobs.id
      
            WHERE applications.candidate_id = $1
      
            ORDER BY applications.applied_at DESC
            `,
            [candidate_id]
        );
        res.status(200).json({
            success:true,
            applications:result.rows,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"server failed",
        });
    }
};

const getapplicationsbyjob =async (req,res)=>{
    try{
        const{jobId}= req.params;

        const result = await pool.query(
            `
            SELECT
      
            users.id,
            users.name,
            users.email,
      
            applications.status,
            applications.applied_at
      
            FROM applications
      
            JOIN users
            ON applications.candidate_id = users.id
      
            WHERE applications.job_id = $1
      
            ORDER BY applications.applied_at DESC
            `,
            [jobId]
        );
        res.status(200).json({
            success:true,
            applications:result.rows,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"server failed",
        })
    }
};


module.exports={
    applyjob,
    getmyapplications,
    getapplicationsbyjob
};