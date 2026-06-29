const ai = require("../config/gemini");

const generateInterviewQuestions = async (resume, job) => {
  try {
    const prompt = `
You are a Senior Technical Interviewer.

Generate 10 interview questions.

Use:

Resume:
${JSON.stringify(resume)}

Job:
${JSON.stringify(job)}

Rules:

Generate

4 Technical

2 Project-based

2 Behavioral

2 HR

Return ONLY JSON.

{
"questions":[
{
"type":"",
"question":""
}
]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    return JSON.parse(text);

  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = generateInterviewQuestions;