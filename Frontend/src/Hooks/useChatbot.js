// import { useState } from "react";

// interface Message{
//     text: String;
//     sender: "user" | "bot";
// }
 
// const useChatbot = () => {
//     const [messages, setMessages] = useState < Message[] > ([]);
//     const sendMessage = async (message: String) => {
//         const newMessages: Message[] = [
//             ...messages,
//             { text: message, sender: "user" },
//         ];
//         setMessages(newMessages);
//         try {
//             const response = await axios.post("https://api.openai.com/v1/chat/completions", {
//                 "model": "gpt-5.2",
//                 messages: {
//                     role: "user",
//                     content:message,
//                 }

//             })
//         } catch (error) {
            
//         }
// }
// }