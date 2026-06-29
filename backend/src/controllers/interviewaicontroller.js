const pool = require("../config/db");
const generateInterviewQuestions =require("../services/interviewaiservice");

const createmockinterview = async (req,res)=>{
    try{
        const userId= req.user.id;
        const {jobId}= req.params;

        console.log("jobId",jobId);
        const resumeResult = await pool.query(
            `select *
            from resume_analysis
            where user_id = $1
            order by created_at DESC
            limit 1`,
            [userId]
        );
        if(resumeResult.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:"Resume analysis not found",
            });
        }
        const jobResult = await pool.query(
            `select * from jobs
            where id = $1`,
            [jobId]
        );

        if(jobResult.rows.length === 0){
            console.error("Job not found");
            return res.status(404).json({
                
                success:false,
                message:"Job not found",
            });
        }
        const questions= await generateInterviewQuestions(
            resumeResult.rows[0],
            jobResult.rows[0]
        );
        await pool.query(
            `insert into mock_interviews
            (user_id,
                job_id,
                questions)
                values(
                    $1,$2,$3
                )

            `,
            [userId,jobId,JSON.stringify(questions.questions)]
        );
        res.status(201).json({
            success:true,
            questions
        });

    }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:error.message,
        });

    }
};
module.exports = {
    createmockinterview
}