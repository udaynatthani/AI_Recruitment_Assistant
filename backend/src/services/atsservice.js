const ai = require("../config/gemini");

const analyzeATS = async (resume, job) => {

const prompt = `
You are an ATS (Applicant Tracking System).

Compare the resume with the job description.

Return ONLY JSON.

{
"atsScore":0,
"matchedSkills":[],
"missingSkills":[],
"strengths":[],
"recommendations":[]
}

Resume:

${JSON.stringify(resume)}

Job:

Title:
${job.title}

Description:
${job.description}

Required Skills:
${job.required_skills}

Experience:
${job.experience}
If the ATS score is below 100,
missingSkills MUST contain every important required skill that is not present in the resume.

Never return an empty missingSkills array unless the ATS score is 100.
`;

const response = await ai.models.generateContent({
model:"gemini-2.5-flash",
contents:prompt
});

let text = response.text;

text = text.replace(/```json/g,"");
text = text.replace(/```/g,"");
text = text.trim();

return JSON.parse(text);

};

module.exports = analyzeATS;