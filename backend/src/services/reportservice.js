const ai = require("../config/gemini");

const generateinterviewreport = async (
    averages,
    evaluations
) => {
    try{
        const prompt = `
You are a Senior Technical Interviewer.

Analyze the following interview evaluations.

Average Scores:

Technical: ${averages.technical}

Communication: ${averages.communication}

Problem Solving: ${averages.problemSolving}

Confidence: ${averages.confidence}

Individual Evaluations:

${JSON.stringify(evaluations)}

Return ONLY valid JSON.

{
  "overallScore":0,
  "strengths":[],
  "weaknesses":[],
  "recommendations":[],
  "hiringDecision":"",
  "summary":""
}
`;
const response= await ai.models.generateContent({
    model:"gemini-2.5-flash",
    contents: prompt,
});

let text = response.text;

text = text.replace(/```json/g, "");
text = text.replace(/```/g, "");
text = text.trim();

return JSON.parse(text);

    }catch(error){
        console.error(error);
        throw error;
    }
};

module.exports= generateinterviewreport