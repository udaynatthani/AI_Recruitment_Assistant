const ai = require("../config/gemini");

const generateRoadmap = async (report) => {
    try {

        const prompt = `
You are an experienced Software Engineering Mentor.

Based on this interview report, create a personalized 4-week learning roadmap.

Interview Report:

${JSON.stringify(report)}

Rules:

- Focus on weak areas.
- Prioritize the most important skills first.
- Suggest practical mini-projects.
- Suggest free learning resources where appropriate.
- Keep the roadmap realistic.

Return ONLY valid JSON.

{
  "roadmap":[
    {
      "week":1,
      "focus":"",
      "topics":[],
      "project":"",
      "goal":""
    }
  ]
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
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

module.exports = generateRoadmap;