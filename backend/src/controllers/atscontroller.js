const pool = require("../config//db");
const analyzeATS = require("../services/atsservice");

const analyzeCandidate = async (req,res)=>{
    try{
        const userId = req.user.id;
        const {jobId} = req.params;

        const resumeresult = await pool.query(
            `select * from resume_analysis
            where user_id = $1
            order by created_at desc 
            limit 1`,
            [userId]
        );

        if(resumeresult.rows.length ===0){
            return res.status(404).json({
                success:false,
                message:"Resume analysis not found. Please upload your resume first.",
            });
        }
        const jobresult = await pool.query(
            `select * from jobs
            where id=$1`,
            [jobId]
        );

        if(jobresult.rows.length ===0){
            return res.status(404).json({
                success:false,
                message:"Job not found.",
            });
        }
        const resume = resumeresult.rows[0];
        const job = jobresult.rows[0];

        const report = await analyzeATS(resume,job);

        await pool.query (
            `INSERT into ats_reports
            (
                user_id,
                job_id,
                ats_score,
                matched_skills,
                missing_skills,
                strengths,
                recommendations
            )
            Values($1,$2,$3,$4,$5,$6,$7)`,
            [
                userId,
                jobId,
                report.atsScore,
                JSON.stringify(report.matchedSkills),
                JSON.stringify(report.missingSkills),
                JSON.stringify(report.strengths),
                JSON.stringify(report.recommendations),
              ]
        );
        res.status(200).json({
            success:true,
            message:"ATS analysis completed successfully",
            report,
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Server failed",
        });
    }
};
module.exports = {analyzeCandidate};