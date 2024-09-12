import React from "react";

const page: React.FC = () => {
  return (
    <div className="p-4 flex flex-col h-full">
      <h1 className="">Group Chat</h1>
      <div className="flex-1"></div>
      <div className="flex gap-2 flex-col">
        <input type="text" className="h-8 rounded px-2 text-black" />
        <button className="w-full h-8 rounded bg-purple-400 hover:bg-purple-500 font-bold text-md text-black">
          Send
        </button>
      </div>
    </div>
  );
};

export default page;
