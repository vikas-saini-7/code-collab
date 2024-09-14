"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  return (
    <div className=" flex flex-col md:flex-row w-full h-screen bg-[#181926]">
      {/* left  */}
      <div className="md:flex-1 py-24 flex gap-2 items-center justify-center">
        {/* <IconCodeCircle2Filled size={32}/> */}
        <h1 className="font-bold text-3xl md:text-5xl text-lg:7xl">
          Code Collab<span className="text-purple-400">.</span>
        </h1>
      </div>

      {/* right  */}
      <div className="flex-1 flex items-start md:items-center justify-center bg-[#1f2130]">
        <div className="flex flex-col space-y-4 w-full max-w-sm px-4">
          <h1 className="font-bold">Enter in a room</h1>
          <input
            className="h-9 rounded px-3 text-black"
            type="text"
            placeholder="Your Name"
          />
          <input
            onChange={(e) => setRoomId(e.target.value)}
            className="h-9 rounded px-3 text-black"
            type="text"
            placeholder="Room Id"
          />
          <Link href={`/${roomId}/files`}>
            <button
              className={`${
                roomId === "" && "opacity-20"
              }  w-full h-9 rounded bg-purple-400 hover:bg-purple-500 font-bold text-xl text-black`}
            >
              Start
            </button>
          </Link>
          <p className="text-blue-400">Generate unique room id</p>
        </div>
      </div>
    </div>
  );
}
