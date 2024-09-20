"use client";
import { useState } from "react";
import { setUsername } from "@/redux/reducers/userReducer";
import { useAppDispatch } from "@/redux/store";
import Link from "next/link";
import { setRoomId } from "@/redux/reducers/roomReducer";

export default function Home() {
  const dispatch = useAppDispatch();

  // store

  // local
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  // handlers
  const handleSetDetails = () => {
    dispatch(setUsername(name));
    dispatch(setRoomId(room));
  };

  const generateRandomRoomId = () => {
    const generateSegment = () => {
      return Math.random().toString(36).substring(2, 5);
    };

    return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
  };

  const HandleGenerateRandomRoomId = () => {
    const uniqueRoomId = generateRandomRoomId();
    setRoom(uniqueRoomId);
  };

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
          <h1 className="font-bold mt-4 md:mt-0">Enter in a room</h1>
          <input
            className="h-9 rounded px-3 text-black"
            type="text"
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            onChange={(e) => setRoom(e.target.value)}
            className="h-9 rounded px-3 text-black"
            type="text"
            placeholder="Room Id"
            value={room}
          />
          <Link href={`/${room}/files`}>
            <button
              disabled={room === "" || name === ""}
              onClick={handleSetDetails}
              className={`${
                (room === "" || name === "") && "opacity-20"
              }  w-full h-9 rounded bg-purple-400 hover:bg-purple-500 font-bold text-xl text-black`}
            >
              Start
            </button>
          </Link>
          <p
            onClick={HandleGenerateRandomRoomId}
            className="text-blue-400 cursor-pointer"
          >
            Generate unique Room Id
          </p>
        </div>
      </div>
    </div>
  );
}
