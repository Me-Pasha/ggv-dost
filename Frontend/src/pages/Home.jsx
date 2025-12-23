import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ChatBox from "../Components/ChatBox";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
const Home = () => {
  const [ChatBoxOpen, setChatBoxOpen] = useState(false);
  const chatBoxRef = useRef();
  const [renderChatBox, setRenderChatBox] = useState(false);
  const [roboButton, setRoboButton] = useState(false);
  useEffect(() => {
    // Reset all panels on initial mount

    gsap.set(chatBoxRef.current, { height: "0%", opacity: 0 });

    gsap.set(chatBoxRef.current, { height: "0%", opacity: 0 });
    const test = async  () => {
       const res = await fetch(
        "https://fast-api-backend-j3dy.onrender.com/docs",
        {
          method: "get",
          headers: { "Content-Type": "application/json" },
          
        }
      );
     
      console.log(res);
    }
    test();
  }, []);

  useGSAP(() => {
    gsap.to(chatBoxRef.current, {
      height: ChatBoxOpen ? "100%" : "0%",
      opacity: ChatBoxOpen ? 1 : 0,
      padding: ChatBoxOpen ? 24 : 0,
    });

    gsap.to(chatBoxRef.current, {
      opacity: ChatBoxOpen ? 1 : 0,
    });
  }, [ChatBoxOpen]);

  return (
    <div className="relative min-h-screen  text-white flex items-center justify-center">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/image.png')" }}
      ></div>

      {!roboButton && (
        <button
          className="absolute bottom-10 right-8 px-4 py-2 bg-lime-400 font-semibold rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110"
          onClick={() => {
            setChatBoxOpen(true);
            setRoboButton(true); 
          }}
        >
          <img src="/robo.svg" alt="icon" className="w-7 h-10" />
        </button>
      )}

      <div ref={chatBoxRef} className="fixed bottom-0 w-full z-10">
        {ChatBoxOpen && (
          <ChatBox setRoboButton={setRoboButton} setChatBoxOpen={setChatBoxOpen} ChatBoxOpen={ChatBoxOpen} />
        )}
      </div>
    </div>
  );
};

export default Home;
