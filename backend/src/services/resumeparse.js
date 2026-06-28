// const { text } = require('express');
const pdfparse = require('pdf-parse');

const parseResume = async (pdfbuffer) => {
    try{
        const data = await pdfparse(pdfbuffer);

        return {
            success: true,
            text:data.text,
            pages: data.numpages,
            info: data.info,
        };

    }catch(error){
        console.error(error);
        return {
            success: false,
            message: "Failed to parse resume",
        };
    }
};
module.exports = parseResume;