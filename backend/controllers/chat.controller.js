import axios from "axios";

export const handleChat = async (req, res) => {
  const { message, targetLanguage, level, messageCount } = req.body;

  if (!message || !targetLanguage || !level) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Short reusable instructions to save tokens
  const systemPrompt = `
You are Language Buddy, a friendly ${targetLanguage} tutor.
User's level: ${level}.
Rules:
- Reply ONLY in ${targetLanguage}.
- Keep answers short (max 3 sentences).
- Adjust complexity for the user's level.
- Correct mistakes briefly.
- Avoid filler text.
`;

  let finalPrompt;

  // Quiz every 5th message
  if (messageCount > 0 && messageCount % 5 === 0) {
    finalPrompt = `
${systemPrompt}
User has sent ${messageCount} messages so far.
Give a short quiz in ${targetLanguage} with 2-3 questions.
Do not explain the answers yet.
Last user message: "${message}"
`;
  } else if (messageCount === 0) {
    // First interaction
    finalPrompt = `
${systemPrompt}
Start with a short friendly greeting in ${targetLanguage} and ask one simple question to begin practice.
User's first message: "${message}"
`;
  } else {
    // Normal conversation
    finalPrompt = `
${systemPrompt}
Continue the conversation naturally.
User: "${message}"
`;
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const geminiRes = await axios.post(endpoint, {
      contents: [{ parts: [{ text: finalPrompt }] }],
    });

    console.log(
      "Gemini raw response:",
      JSON.stringify(geminiRes.data, null, 2)
    );

    const reply =
      geminiRes?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!reply) {
      console.error("Gemini API did not return valid reply:", geminiRes.data);
      return res
        .status(500)
        .json({ error: "No valid reply from Gemini API" });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Gemini API error",
      detail: error.response?.data || error.message,
    });
  }
};
