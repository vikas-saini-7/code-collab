"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useRoomContext } from "@/providers/roomContextProvider";

const page: React.FC = () => {
  // store
  const activeUsers = useAppSelector((item) => item.room.activeUsers);

  const { roomData, loading, error } = useRoomContext();

  return (
    <div className="p-4">
      <h1 className="mb-2">Collaborators</h1>
      <div className="grid grid-cols-3 gap-2">
        {roomData?.participants?.map((item, idx) => (
          <div
            className="w-full py-2 min-h-14 bg-gray-500/10 rounded flex gap-1 flex-col items-center justify-center"
            key={idx}
          >
            <span className="relative w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-sm">
              {item?.user.fullName.charAt(0).toUpperCase()}
              <span className="absolute top-0 -right-1 w-[7px] h-[7px] rounded-full bg-green-500"></span>
            </span>
            <p className="text-xs">{item?.user?.fullName}</p>
            {/* <p className="text-xs">{item?.user?.username}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
