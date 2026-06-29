const pool = require("../config/db");
const generateinterviewreport = require("../services/reportservice");

const getinterviewreport = async(req,res)=>{
    try{
        const userId = req.user.id;
        const {mockintervieId}= req.params;

        const interview = await pool.query(
            `SELECT *
            from mock_interviews
            where id = $1
            and user_id = $2`,
            [mockintervieId,userId]
        );
        if(interview.rows.length===0){
            return res.status(403).json({
                success:false,
                message:"Access denied. You are not authorized to view this interview report."
            });
        }

        const answer = await pool.query(
            `select *
            from interview_answers
            where mock_interview_id = $1`,
            [mockintervieId]
        );

        if(answer.rows.length === 0){
            return res.status(404).json({
                success: false,
                message:"no interview answer found"
            })
        }
        const evaluations = answer.rows.map(
            (item) => item.evaluation
          );
      
          const average = (key) => {
            return (
              evaluations.reduce(
                (sum, e) => sum + Number(e[key]),
                0
              ) / evaluations.length
            ).toFixed(2);
          };
      
          const averages = {
            technical: average("technicalScore"),
            communication: average("communicationScore"),
            problemSolving: average("problemSolvingScore"),
            confidence: average("confidenceScore"),
          };
      
          const report = await generateinterviewreport(
            averages,
            evaluations
          );
      
          await pool.query(
            `
            INSERT INTO interview_reports
            (
              mock_interview_id,
              overall_score,
              technical_score,
              communication_score,
              problem_solving_score,
              confidence_score,
              strengths,
              weaknesses,
              recommendations,
              hiring_decision,
              summary
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            `,
            [
            mockintervieId,
              report.overallScore,
              averages.technical,
              averages.communication,
              averages.problemSolving,
              averages.confidence,
              JSON.stringify(report.strengths),
              JSON.stringify(report.weaknesses),
              JSON.stringify(report.recommendations),
              report.hiringDecision,
              report.summary,
            ]
          );
      
          res.status(200).json({
            success: true,
            report: {
              ...report,
              technicalScore: averages.technical,
              communicationScore: averages.communication,
              problemSolvingScore: averages.problemSolving,
              confidenceScore: averages.confidence,
            },
          });

    }catch(error){
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {getinterviewreport};