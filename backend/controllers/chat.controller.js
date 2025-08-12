import axios from "axios";

export const handleChat = async (req, res) => {
  const { message, targetLanguage, level, mode } = req.body;

  if (!message || !targetLanguage || !level) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let finalPrompt;

  if (mode === "translate") {
    finalPrompt = `
Translate the following text into ${targetLanguage} naturally and fluently.
Respond ONLY with the translated text, no explanations.

Text: "${message}"
`;
  } else {
    finalPrompt = `
You are GrammarFixer, an expert ${targetLanguage} grammar and spelling correction tool.
User's proficiency level: ${level}.

Strict rules:
1. ONLY check grammar and spelling for the given sentence.
2. If the sentence is 100% correct, respond: "✅ Correct" (no explanation, no extra text).
3. If incorrect:
   - First line: ✅ Correct: <corrected sentence>
   - Second line: 📌 Short explanation of the grammar or spelling errors (ONLY mention actual mistakes — do NOT invent errors).
   - Third line (optional): 💡 Alternative phrasing (if useful and natural).
4. Before flagging a spelling error, confirm it is truly misspelled according to standard ${targetLanguage} dictionaries.
5. Never correct words that are already correct.
6. Always reply in ${targetLanguage}.
7. Do NOT continue conversation, ask questions, or add unrelated comments.

User sentence: "${message}"
Check and correct it according to the rules.
`;
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const geminiRes = await axios.post(endpoint, {
      contents: [{ parts: [{ text: finalPrompt }] }],
    });

    const reply = geminiRes?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!reply) {
      return res.status(500).json({ error: "No valid reply from Gemini API" });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: "Gemini API error",
      status: error.response?.status,
      detail: error.response?.data || error.message,
    });
  }
};
