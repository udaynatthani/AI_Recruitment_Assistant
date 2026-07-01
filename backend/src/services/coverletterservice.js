const ai = require("../config/gemini");

const generateCoverLetter = async (resumeAnalysis, job) => {
    try {

        const prompt = `
You are an expert HR Manager and Career Coach.

Generate a professional cover letter based on the candidate's resume analysis and the job description.

Return ONLY the cover letter.

Do NOT use markdown.
Do NOT use \`\`\`.
Do NOT explain anything.

Candidate Resume Analysis:

${JSON.stringify(resumeAnalysis, null, 2)}

Job Details:

Title: ${job.title}

Company: ${job.company_name}

Location: ${job.location}

Required Skills:
${job.required_skills}

Job Description:
${job.description}

Instructions:

- Keep the cover letter between 250-400 words.
- Use a professional and confident tone.
- Mention the candidate's relevant skills.
- Mention projects or experience if available.
- Explain why the candidate is interested in this role.
- Mention the company name naturally.
- End with a professional closing.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {

        console.error(error);

        throw new Error("Failed to generate cover letter");

    }
};

module.exports = generateCoverLetter;