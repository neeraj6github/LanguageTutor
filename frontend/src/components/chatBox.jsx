import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const translateLanguages = [
  "Hindi",
  "French",
  "Spanish",
  "Japanese",
  "German",
  "English",
  "Punjabi",
  "Haryanvi",
  "Tamil",
  "Marathi",
];

const ChatBox = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState("French");
  const [level, setLevel] = useState("Beginner");
  const [messageCount, setMessageCount] = useState(0);
  const chatContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        { message, targetLanguage, level, messageCount: messageCount + 1 }
      );

      const reply = res?.data?.reply;

      if (!reply || typeof reply !== "string") {
        alert("Bot did not respond correctly.");
        return;
      }

      setChat((prevChat) => [
        ...prevChat,
        { from: "user", text: message },
        { from: "bot", text: reply },
      ]);
      setMessage("");
      setMessageCount((prev) => prev + 1);

      // Scroll to bottom after new message
      setTimeout(() => {
        if (chatContainerRef.current)
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 100);
    } catch (err) {
      console.error("Chat API error:", err.response?.data || err.message);
      alert("Something went wrong!");
    }
  };

  const handleTranslate = async (textToTranslate, language) => {
    if (!textToTranslate.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        {
          message: textToTranslate,
          targetLanguage: language,
          level,
          mode: "translate",
        }
      );

      const reply = res?.data?.reply;

      if (!reply || typeof reply !== "string") {
        alert("Translation failed, please try again.");
        return;
      }

      setChat((prevChat) => [
        ...prevChat,
        { from: "user", text: textToTranslate },
        { from: "bot", text: `🈯 Translation:\n${reply}` },
      ]);

      setTimeout(() => {
        if (chatContainerRef.current)
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 100);
    } catch (err) {
      console.error("Translate API error:", err.response?.data || err.message);
      alert("Translation error! Check console.");
    }
  };

  const handleNewChat = () => {
    setChat([]);
    setMessageCount(0);
  };

  const cleanResponse = (text) => {
    const parts = [];
    const codeBlockRegex = /```([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const before = text
        .slice(lastIndex, match.index)
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/^[-*]\s+/gm, "")
        .replace(/(\n){3,}/g, "\n\n")
        .trim();

      if (before) parts.push({ type: "text", content: before });
      parts.push({ type: "code", content: match[1].trim() });
      lastIndex = codeBlockRegex.lastIndex;
    }

    const after = text
      .slice(lastIndex)
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^[-*]\s+/gm, "")
      .replace(/(\n){3,}/g, "\n\n")
      .trim();

    if (after) parts.push({ type: "text", content: after });

    return parts;
  };

  const renderCleanedText = (text) => {
    if (typeof text !== "string") return null;

    const parts = cleanResponse(text);
    return parts.map((part, idx) => {
      if (part.type === "code") {
        return (
          <pre
            key={idx}
            className="bg-gray-100 text-gray-900 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono text-xs md:text-sm"
          >
            <code>{part.content}</code>
          </pre>
        );
      }
      return (
        <p
          key={idx}
          className="whitespace-pre-wrap text-sm md:text-base"
        >
          {part.content}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#973aa8] via-[#6411ad] to-[#3a0ca3] text-white">
      <Navbar />

      {/* Info text */}
      <div className="max-w-4xl mx-auto px-4 mt-4 mb-2 text-center text-[#d0d4f7] font-semibold text-sm sm:text-base">
        You can check your grammar here at top and translate text at bottom.
      </div>

      <main className="flex-1 flex flex-col px-4 py-5 sm:px-6 max-w-4xl mx-auto w-full">
        
        {/* Language & Level Selectors */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white text-[#3a0ca3] font-semibold w-full sm:w-auto"
          >
            {translateLanguages.map((lang) => (
              <option key={lang}>{lang}</option>
            ))}
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white text-[#3a0ca3] font-semibold w-full sm:w-auto"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <button
            onClick={handleNewChat}
            className="bg-[#ff4d6d] hover:bg-[#ff3366] px-4 py-2 rounded-lg font-semibold w-full sm:w-auto transition-colors"
          >
            New Chat
          </button>
        </div>

        {/* Chat Window */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-[#3a0ca3] scrollbar-track-[#4c44b7]/30 rounded-lg p-3 bg-white text-[#3a0ca3]"
          style={{ minHeight: "100px" }}
        >
          {chat.length === 0 && (
            <p className="text-center text-[#6411ad]/70 mt-10 select-none italic">
              Start practicing {targetLanguage} with Language Buddy...
            </p>
          )}
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`relative p-4 sm:p-5 rounded-2xl max-w-[80%] md:max-w-[60%] break-words shadow-md ${
                msg.from === "user"
                  ? "ml-auto bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1e40af] text-white text-right" // blue gradient user msg
                  : "mr-auto bg-gradient-to-r from-[#6a63d9] via-[#5f56c8] to-[#4c44b7] text-white text-left"
              }`}
            >
              {msg.from === "bot" ? renderCleanedText(msg.text) : msg.text}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Type your ${targetLanguage} sentence here...`}
            className="flex-1 rounded-lg border border-[#3a0ca3] bg-white text-[#3a0ca3] placeholder-[#3a0ca3] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3a0ca3] text-sm sm:text-base"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-[#3a0ca3] hover:bg-[#2563eb] transition-colors text-white rounded-lg px-4 py-2 text-sm sm:px-6 sm:text-base font-semibold"
          >
            Send
          </button>
        </form>

        {/* Translate Buttons */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {translateLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleTranslate(message, lang)}
              disabled={!message.trim()}
              className="bg-[#3a0ca3] hover:bg-[#2563eb] disabled:bg-gray-400 text-white rounded-lg px-3 py-1 text-xs sm:text-sm font-semibold transition-colors"
              title={`Translate to ${lang}`}
            >
              Translate to {lang}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ChatBox;
