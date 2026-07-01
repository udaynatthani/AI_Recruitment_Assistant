const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authroutes');
const jobRoutes = require("./routes/jobroutes");
const applicationRoutes = require("./routes/applicationroutes");
const resumeroutes = require("./routes/resumeroutes");
const atsRoutes = require("./routes/atsroutes");
const interviewRoutes = require("./routes/interviewroutes");
const interviewaiRoutes = require("./routes/interviewairoutes");
const answerRoutes = require("./routes/answerroutes");
const reportRoutes = require("./routes/reportroutes");
const roadmapRoutes = require("./routes/roadmaproutes");
const recruiterDashboardRoutes = require("./routes/recruiterDashboardRoutes");
const savejobroutes = require("./routes/savejobroutes");
const coverLetterRoutes = require("./routes/coverletterroutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/api/jobs", jobRoutes);      
app.use("/api/applications", applicationRoutes);
app.use("/api/resumes", resumeroutes);
app.use("/api/ats", atsRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/interviewai", interviewaiRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/interview-report", reportRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/recruiter/dashboard", recruiterDashboardRoutes);
app.use("/api/saved-jobs", savejobroutes);
app.use("/api/cover-letter", coverLetterRoutes);

app.get('/', (req, res) => {  
    res.json({ message: 'Hello from the backend!' });
});

module.exports = app;