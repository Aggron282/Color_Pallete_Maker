require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

module.exports.chatWithGPT = async function chatWithGPT(message) {
    try {
        const {data} = await axios.post(
            API_URL,
            {
                model: "gpt-4o-mini",
                messages:[
                  {"role": "system", "content": "You help me recommend colors based on pallete or color"},
                  {"role": "user", "content": message}
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        let content = data.choices[0].message.content;

        content = content.replace(/```json\n|```/g, "");

        const json = JSON.parse(content);

        return json;

    } catch (error) {
      console.log(error)
        console.error("Error:", error.response ? error.response.data : error.message);
        return null;
    }
}
