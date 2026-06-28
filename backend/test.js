require("dotenv").config();

const { sendInterviewEmail } = require("./src/services/mailservice");

sendInterviewEmail({
  to: "championdevil897@gmail.com",
  candidateName: "Uday",
  companyName: "OpenAI",
  jobTitle: "Full Stack Developer",
  interviewDate: "5 July 2026",
  interviewTime: "11:00 AM",
  interviewMode: "Online",
  meetingLink: "https://meet.google.com/test",
});