import React from "react";

const ChatHeader = ({ setChatBoxOpen, setRoboButton }) => {
  return (
    <div className="bg-white rounded-t-3xl">
      <div className="text-black px-4  py-3 border-b-2 ">
        <div className="flex justify-between px-2">
          <div className=" flex gap-2">
            <img
              className="w-9 object-cover "
              src="https://gyaanarth.com/wp-content/uploads/2022/07/Guru-Ghasidas-Vishwavidyalaya.logo_-1024x1024.jpg"
              alt=""
            />
            <div>
              <h3 className="text-lg font-semibold mt-1">GGV Dost</h3>
            </div>
          </div>
          <div className="flex gap-3 mt-2 bg-[#f2ceca] rounded-full w-6 h-6  justify-center items-center">
            <svg
              onClick={() => {
                setChatBoxOpen(false);
                setRoboButton(false);
              }
              }
              className="w-3 h-3 text-[#a45148]  rounded-full  cursor-pointer"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
