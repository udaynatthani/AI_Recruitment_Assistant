const pool = require("../config/db");

const scheduleInterview = async (req, res) => {
    try{
        const recruiterId = req.user.id;
        
        const {
            candidate_id,
            job_id,
            interview_date,
            interview_time,
            interview_mode,
            meeting_link,
            location,
            notes
          } = req.body;
          if(
!candidate_id || !job_id || !interview_date || !interview_time || !interview_mode
          ){
            return res.status(400).json({
                success: false,
                message:"please provide all required fields"
            });

          }

          const result = await pool.query(
            `INSERT INTO interviews
            (
                candidate_id,
                recruiter_id,
                job_id,
                interview_date,
                interview_time,
                interview_mode,
                meeting_link,
                location,
                notes
            )
            values
            ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            returning *`,
            [
                candidate_id,
                recruiterId,
                job_id,
                interview_date,
                interview_time,
                interview_mode,
                meeting_link,
                location,
                notes
            ]
          );
          res.status(201).json({
            success:true,
            message:"Interview scheduled successfully",
            interview:result.rows[0],
          });
          
    }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"server failed",
        });
    }
};

const getMyInterviews = async (req,res)=>{
    try{
    const candidateId = req.user.id;

    const result = await pool.query(
        `select 
        interviews.*,
        jobs.title,
        jobs.company_name,
        users.name as recruiter_name
        from interviews
        join jobs
        on interviews.job_id = jobs.id
        
        join users
        on interviews.recruiter_id = users.id
        
        where interviews.candidate_id = $1
        
        order by interview_date ASC, interview_time ASC`,
        [candidateId]
    );
    res.status(200).json({
        success :true,
        interviews:result.rows,
    });
}catch(error){
    console.error(error);
    res.status(500).json({
        success:false,
        message:"server failed",
    });

}
};

const getrecruiterinterviews = async (req,res)=>{
    try{
        const recruiterId = req.user.id;

        const result = await pool.query(
            `select 
            interviews.*,
            users.name as candidate_name,
            users.email,
            jobs.title
            from interviews
            join users
            on interviews.candidate_id = users.id
            
            join jobs 
            on interviews.job_id=jobs.id
            where interviews.recruiter_id = $1
            order by interview_date ASC,interview_time ASC`,
            [recruiterId]
        );
        res.status(200).json({
            success:true,
            interviews:result.rows,
        });

    }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"server failed",
        });
}
};

const updateinterviewstatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      // Valid statuses
      const allowedStatus = [
        "Scheduled",
        "Completed",
        "Cancelled",
        "Rescheduled",
      ];
  
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid interview status",
        });
      }
  
      // Check interview exists
      const interview = await pool.query(
        "SELECT * FROM interviews WHERE id = $1",
        [id]
      );
  
      if (interview.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }
  
      // Check ownership
      if (interview.rows[0].recruiter_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this interview",
        });
      }
  
      // Update status
      const result = await pool.query(
        `
        UPDATE interviews
        SET status = $1
        WHERE id = $2
        RETURNING *
        `,
        [status, id]
      );
  
      res.status(200).json({
        success: true,
        message: "Interview status updated successfully",
        interview: result.rows[0],
      });
  
    } catch (error) {
      console.error(error);
  
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports= {
    scheduleInterview,
    getMyInterviews,
    getrecruiterinterviews,
    updateinterviewstatus
};