const pool = require("../config/db");
const evaluateAnswer = require("../services/answerservice");

const submitAnswer = async (req,res)=>{
    try{

        
        const {mockinterviewid}= req.params;
        const userId = req.user.id;

        const interview = await pool.query(
            `
            SELECT *
            FROM mock_interviews
            WHERE id = $1
            AND user_id = $2
            `,
            [mockinterviewid, userId]
        );
        
        if (interview.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Mock interview not found or access denied"
            });
        }
        const {
            question,
            answer
        }= req.body;
        const evaluation = await evaluateAnswer(question,answer);
        // console.log("evaluation",evaluation);

       await pool.query(
            `insert into interview_answers(
                mock_interview_id,
                question,
                answer,
                evaluation
            )
            values($1,$2,$3,$4)`,
            [mockinterviewid,question,answer,evaluation]
        );
        

        res.status(200).json({
            success:true,
            evaluation
        });

    }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:error.message || "server failed",
        });
    }
};

module.exports = {
    submitAnswer
}