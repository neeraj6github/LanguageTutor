import axios from 'axios';

export const getGeminiResponse = async (prompt) => {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const cleanPrompt = `Reply in plain text. Do not use markdown or bullet points. Just give a short, clean answer. Here's the question: ${prompt}`;

  try {
    const res = await axios.post(endpoint, {
      contents: [{ parts: [{ text: cleanPrompt }] }],
    });

    const reply = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error(" Gemini API returned unexpected structure:", res.data);
      return "Sorry, I couldn't generate a response.";
    }

    return reply;
  } catch (err) {
    console.error(" Gemini API error:", err.response?.data || err.message);
    return "Gemini API failed to respond.";
  }
};
