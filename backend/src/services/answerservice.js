const ai = require("../config/gemini");

const evaluateAnswer = async (question, answer) => {

    try {

        const prompt = `
You are a Senior Technical Interviewer.

Evaluate the candidate's answer.

Question:
${question}

Answer:
${answer}

Return ONLY valid JSON.

{
  "technicalScore": 0,
  "communicationScore": 0,
  "problemSolvingScore": 0,
  "confidenceScore": 0,
  "strengths": [],
  "weaknesses": [],
  "feedback": ""
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

module.exports = evaluateAnswer;