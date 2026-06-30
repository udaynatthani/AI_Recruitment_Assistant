const pool = require("../config/db");
const generateSlug = require("../utils/generateslug");

const createjob = async (req, res) => {
    try{
        const
        {
           title,
           company_name,
           location,
           salary,
           experience,
           job_type,
           required_skills,
           description,
           application_deadline,
           
       } = req.body;
        const recruiterId = req.user.id;

const slug = await generateSlug(
    title,
    company_name
);

    
// salary is not there in below because many job portal is allowing post without disclose there salary
        if(!title || !company_name || !location  || !experience || !job_type || !required_skills || !description || !application_deadline
        ){
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }
        const created_by = req.user.id;

        const result = await pool.query(
            `
            INSERT INTO jobs
            (
            title,
            company_name,
            slug,
            location,
            salary,
            experience,
            job_type,
            required_skills,
            description,
            application_deadline,
            created_by,
            recruiter_id
            )
            VALUES
            (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
            )
            RETURNING *
            `,
            [
            title,
            company_name,
            slug,
            location,
            salary,
            experience,
            job_type,
            required_skills,
            description,
            application_deadline,
            recruiterId,
            recruiterId
            ]
            );
        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job: result.rows[0],
        });
    }catch(error){
        console.error(error),
        res.status(500).json({
           
            success:false,
            message:"server failed",
        });

    }
};
const getalljob = async (req,res)=>{
    try{
        const result = await pool.query (
            `select jobs.*,users.name as recruiter_name
            From jobs
            join users on jobs.created_by = users.id
            order by jobs.create_at desc`
        );
        res.status(200).json({
            success:true,
            total:result.rows.length,
            jobs:result.rows,
        });
    
    }catch(error){
        res.status(500).json({
            success:false,
            message:"server failed",
        });
    }

};

const getjobbyid = async (req,res)=>{
    try{

        const slug = req.params;
        console.log(slug);
        // const {id}= req.params;

        const result = await pool.query(
            `select jobs.* from jobs
            where slug = $1`,
            [slug.id]
        );

        if(result.rows.length ===0){
            return res.status(404).json({
                success:false,
                message:"Job not found",
            });
        }
        res.status(200).json({
            success:true,
            job:result.rows[0],
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"server failed",
        });
    }   
};

const updatejob  = async (req,res)=>{
    try{
        console.log("Params:", req.params);

    const { slug } = req.params;

    console.log("Slug:", slug);

    const job = await pool.query(
      `
      SELECT *
      FROM jobs
      WHERE slug = $1
      `,
      [slug]
    );
          console.log(job.rows);
          
          if (job.rows.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Job not found",
            });
          }
          
      
          if (job.rows[0].created_by !== req.user.id) {
            return res.status(403).json({
              success: false,
              message: "You are not authorized to update this job",
            });
          }
          
        const {
            title,
            company_name,
            location,
            salary,
            experience,
            job_type,
            required_skills,
            description,
            application_deadline,
          } = req.body;

          const result = await pool.query(
            `UPDATE JOBS
            SET
            title=$1,
            company_name=$2,
            location  = $3,
            salary=$4,
            experience=$5,
            job_type=$6,
            required_skills=$7,
            description=$8,
            application_deadline=$9
            WHERE slug=$10
            RETURNING *`,
            [
              title,
              company_name,
              location,
              salary,
              experience,
              job_type,
              required_skills,
              description,
              application_deadline,
              slug,
            ]
            
          );
          if(result.rows.length ===0){
            return res.status(404).json({
                success:false,
                message:"Job not found",
            });
          }
          res.status(200).json({
            success:true,
            message:"Job updated successfully",
            job:result.rows[0],
          });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }   
};

const deletejob = async (req,res)=>{
    try{
        const slug = req.params;

        // const {id} = req.params;

        const job = await pool.query(
            "SELECT * FROM jobs WHERE slug = $1",
            [slug]
          );
          
          if (job.rows.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Job not found",
            });
          }
          
          if (job.rows[0].created_by !== req.user.id) {
            return res.status(403).json({
              success: false,
              message: "You are not authorized to delete this job",
            });
          }
        const result = await pool.query(
            `delete from jobs
            where slug = $1
            returning *`,
            [slug]
        );
        if(result.rows.length ===0){
            return res.status(404).json({
                success:false,
                message:"Job not found",
            });
        }
        res.status(200).json({
            success:true,
            message:"Job deleted successfully",
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

module.exports = {
    createjob,
    getalljob,
    getjobbyid,
    updatejob,
    deletejob
}