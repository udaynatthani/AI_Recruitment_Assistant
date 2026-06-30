const pool = require("../config/db");
const { sendInterviewEmail } = require("../services/mailservice");

const scheduleInterview = async (req, res) => {

    try {

        const recruiterId = req.user.id;

        const { slug } = req.params;

        let {

            candidate_id,
            interview_date,
            interview_time,
            interview_mode,
            meeting_link,
            location,
            notes

        } = req.body;

        // Find Job by Slug
        const jobResult = await pool.query(
            `
            SELECT id,title,company_name,created_by
            FROM jobs
            WHERE slug = $1
            `,
            [slug]
        );

        if (jobResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const job = jobResult.rows[0];

        // Ownership Check
        if (job.created_by !== recruiterId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Normalize Mode
        interview_mode =
            interview_mode.charAt(0).toUpperCase() +
            interview_mode.slice(1).toLowerCase();

        if (!["Online", "Offline"].includes(interview_mode)) {
            return res.status(400).json({
                success: false,
                message: "Interview mode must be Online or Offline"
            });
        }

        // Online Validation
        if (interview_mode === "Online") {

            if (!meeting_link) {
                return res.status(400).json({
                    success: false,
                    message: "Meeting link is required"
                });
            }

            location = null;
        }

        // Offline Validation
        if (interview_mode === "Offline") {

            if (!location) {
                return res.status(400).json({
                    success: false,
                    message: "Location is required"
                });
            }

            meeting_link = null;
        }

        // Future Date Validation
        const interviewDateTime = new Date(
            `${interview_date}T${interview_time}`
        );

        if (interviewDateTime <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Interview must be scheduled in the future"
            });
        }

        // Duplicate Interview Check
        const existing = await pool.query(
            `
            SELECT id
            FROM interviews
            WHERE candidate_id=$1
            AND job_id=$2
            AND status!='Cancelled'
            `,
            [candidate_id, job.id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Interview already scheduled"
            });
        }

        // Insert Interview
        const interview = await pool.query(
            `
            INSERT INTO interviews
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
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *
            `,
            [
                candidate_id,
                recruiterId,
                job.id,
                interview_date,
                interview_time,
                interview_mode,
                meeting_link,
                location,
                notes
            ]
        );

        
        const candidate = await pool.query(
            `
            SELECT name,email
            FROM users
            WHERE id=$1
            `,
            [candidate_id]
        );
        

        await sendInterviewEmail({
            to: candidate.rows[0].email,
            candidateName: candidate.rows[0].name,
            companyName: job.company_name,
            jobTitle: job.title,
            interviewDate: interview_date,
            interviewTime: interview_time,
            interviewMode: interview_mode,
            meetingLink: meeting_link,
            location
        });

        res.status(201).json({
            success: true,
            message: "Interview scheduled successfully",
            interview: interview.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
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
        message:error.message,
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