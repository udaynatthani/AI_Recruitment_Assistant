const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInterviewEmail = async ({
  to,
  candidateName,
  companyName,
  jobTitle,
  interviewDate,
  interviewTime,
  interviewMode,
  meetingLink,
  location,
}) => {
  const html = `
  <div style="font-family:Arial,sans-serif;padding:20px">
  
    <h2>Interview Invitation</h2>

    <p>Hello <strong>${candidateName}</strong>,</p>

    <p>
      Congratulations!
      You have been shortlisted for the next round.
    </p>

    <table cellpadding="8">

      <tr>
        <td><b>Company</b></td>
        <td>${companyName}</td>
      </tr>

      <tr>
        <td><b>Role</b></td>
        <td>${jobTitle}</td>
      </tr>

      <tr>
        <td><b>Date</b></td>
        <td>${interviewDate}</td>
      </tr>

      <tr>
        <td><b>Time</b></td>
        <td>${interviewTime}</td>
      </tr>

      <tr>
        <td><b>Mode</b></td>
        <td>${interviewMode}</td>
      </tr>

      ${
        interviewMode === "Online"
          ? `
      <tr>
        <td><b>Meeting Link</b></td>
        <td>
          <a href="${meetingLink}">
            Join Interview
          </a>
        </td>
      </tr>
      `
          : `
      <tr>
        <td><b>Location</b></td>
        <td>${location}</td>
      </tr>
      `
      }

    </table>

    <br>

    <p>Best of luck!</p>

    <p>
      Regards,<br>
        ${companyName} Team
    </p>

  </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Interview Invitation",
    html,
  });
};

module.exports = {
  sendInterviewEmail,
};