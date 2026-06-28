const ai = require("../config/gemini");

const analyzeresume = async (resumeText) => {
    try{
        const prompt = `
        You are an AI Resume Analyzer.
        
        Analyze the resume below.
        
        Return ONLY valid JSON.
        
        Do NOT use markdown.
        Do NOT wrap the response inside \`\`\`json.
        Do NOT explain anything.
        
        Return exactly this format:
        
        {
          "name":"",
          "email":"",
          "phone":"",
          "skills":[],
          "projects":[],
          "experience":[],
          "education":[],
          "certifications":[],
          "summary":""
        }
        
        Resume:
        
        ${resumeText}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
          });
          
          let text = response.text;
          
          // Remove markdown code fences if Gemini adds them
          text = text.replace(/```json/g, "");
          text = text.replace(/```/g, "");
          text = text.trim();
          
          return JSON.parse(text);
    }catch(error){
        console.error(error);
        return {
            success: false,
            message: "Failed to analyze resume",
        };
    }
};
module.exports = analyzeresume;