import React, { useRef, useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import commonQuestions from "../Data/commonQuestions.json";
const ChatBox = ({ setChatBoxOpen, ChatBoxOpen, setRoboButton }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingDone, setTypingDone] = useState(false);

  const [loading, setLoading] = useState(false);
  const scrollToAns = useRef();
  useEffect(() => {
    if (scrollToAns.current) {
      const timer = setTimeout(() => {
        scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
      }, 700); 

      return () => clearTimeout(timer);
    }
  }, [messages]);
  const formatText = (text) => {
    if (typeof text !== "string") {
      return null; 
    }

    return text.split("\n").map((line, i) => {
  
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
        "https://fastapi-dost-581010234750.asia-south1.run.app/ask",
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
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Limit Reached: Contact Developer" },
      ]);
    }
  };
  const handleFAQClick = (item) => {
    setMessages((prev) => [...prev, { role: "user", text: item.question }]);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessages((prev) => [...prev, { role: "bot", text: item.answer }]);
    }, 400);
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
        className="flex flex-col overflow-scroll no-scrollbar h-[77%] px-1 "
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
        <div className="mt-1 ">
          {messages.length === 0 && typingDone && (
            <div className="flex flex-col gap-2 items-end mt-40">
              {commonQuestions.map((item) => (
                <h1
                  key={item.id}
                  onClick={() => handleFAQClick(item)}
                  className="cursor-pointer text-purple-600 text-sm font-medium
                   w-fit px-3 py-2 border rounded-xl bg-white
                   hover:bg-purple-50"
                >
                  {item.question}
                </h1>
              ))}
              {loading && (
                <div className="bg-blue-50 text-gray-700 p-3 rounded-xl mx-2 mt-2 w-fit">
                  Thinking...
                </div>
              )}
            </div>
          )}
        </div>

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl mt-1 mb-1 mx-2  ${
              msg.role === "user"
                ? "bg-purple-500 text-white ml-auto -mt-9 max-w-[84%]"
                : "bg-blue-50 text-gray-900 break-words whitespace-pre-wrap w-fit mb- "
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
        className=" group
    text-black absolute bottom-6 bg-white
    border-2 border-gray-500 w-[93%]
    flex justify-between ml-3 py-1 px-4 rounded-xl
    transition-all duration-200
    focus-within:border-[3px]
    focus-within:border-purple-600"
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
        <button
          onClick={handleSendMessage}
          className="
    transition-all duration-200
    group-focus-within:text-purple-800
    text-gray-700
    active:scale-90
  "
        >
          <i className="ri-send-plane-2-line  text-xl "></i>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
