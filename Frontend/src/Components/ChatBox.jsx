import React, { useRef, useState } from "react";
import ChatHeader from "./ChatHeader";

const ChatBox = ({ setChatBoxOpen, ChatBoxOpen, setRoboButton }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingDone, setTypingDone] = useState(false);

  const [loading, setLoading] = useState(false);
  const scrollToAns = useRef();

  const formatText = (text) => {
    return text.split("\n").map((line, i) => {
      // • **Heading:** description
      const boldMatch = line.match(/^\s*[•*]\s*\*\*(.+?):\*\*\s*(.*)/);

      if (boldMatch) {
        return (
          <div key={i} className="mt-2">
            <span className="font-bold">{boldMatch[1]}:</span>{" "}
            <span>{boldMatch[2]}</span>
          </div>
        );
      }

      // normal bullet
      if (line.startsWith("* ") || line.startsWith("• ")) {
        return (
          <div key={i} className="ml-3">
            • {line.replace(/^(\*|•)\s*/, "")}
          </div>
        );
      }

      if (/^\s*[*•]\s+/.test(line)) {
        return (
          <div key={i} className="ml-4 flex gap-2">
            {" "}
            <span>•</span> <span>{line.replace(/^\s*[*•]\s+/, "")}</span>{" "}
          </div>
        );
      }

      return <div key={i}>{line}</div>;
    });
  };

  const handleSendMessage = async () => {
    if (!question.trim()) return;

    const userMsg = question;

    setLoading(true);
    // user message
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setQuestion("");

    try {
      const res = await fetch(
        "https://fast-api-backend-j3dy.onrender.com/ask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: userMsg }),
        }
      );

      const data = await res.json();
      console.log(data);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.answer || "No response" },
      ]);
      setLoading(false);
      setTimeout(() => {
        scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
      }, 500);
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Limit Reached: Contact Developer" },
      ]);
    }
  };

  return (
    <div className="absolute bottom-[13%] right-8 w-80 bg-gray-200 h-4/5 rounded-3xl ">
      <ChatHeader
        setRoboButton={setRoboButton}
        setChatBoxOpen={setChatBoxOpen}
        ChatBoxOpen={ChatBoxOpen}
      />

      <div
        ref={scrollToAns}
        className="flex flex-col overflow-y-auto no-scrollbar h-[70%] px-1 "
      >
        {messages.length === 0 && !typingDone && (
          <div className="h-[60vh] flex items-center justify-center">
            <h1
              className="typing text-xl font-mono bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 font-semibold"
              onAnimationEnd={() => setTypingDone(true)}
            >
              GGV DOST(Data-Driven OnBoarding Support Tool)
            </h1>
          </div>
        )}

        {messages.length === 0 && typingDone && (
          <h1 className="text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 text-2xl font-semibold mt-12">
            Feel free to ask anything about GGV
          </h1>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl mt-2 mb-1 mx-2  ${
              msg.role === "user"
                ? "bg-purple-500 text-white ml-auto mt-2 max-w-[80%]"
                : "bg-blue-50 text-gray-900 break-words whitespace-pre-wrap w-fit"
            }`}
          >
            {formatText(msg.text)}
          </div>
        ))}
        {loading && (
          <div className="bg-blue-50 text-gray-700 p-3 rounded-xl mx-2 mt-2 w-fit">
            Thinking...
          </div>
        )}
      </div>

      <div
        className="text-black absolute bottom-6 bg-white border-2 border-gray-500 w-[92%] flex justify-between  ml-4 py-1 px-4 rounded-xl  
       focus-within:border-[3px] focus-within:border-purple-600 
                
                transition-all duration-200"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="outline-none w-full text-base font-normal text-gray-900 "
          placeholder="Ask something?"
        />
        <button onClick={handleSendMessage}>
          <i className="ri-send-plane-2-line text-gray-700 text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
