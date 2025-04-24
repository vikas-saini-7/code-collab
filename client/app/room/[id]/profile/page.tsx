"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";

const Page = () => {
  const profile = useSelector((state: RootState) => state.profile);

  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="mb-4">Profile</h2>

      <div className="flex flex-row items-center gap-4 mb-8">
        {profile.profilePicture ? (
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#00E87B]">
            <Image
              src={profile.profilePicture}
              alt="Profile"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#00E87B]">
            <span className="text-xl text-[#00E87B]">
              {profile.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h3 className="text-xl font-medium">
            {profile.fullName || "No name set"}
          </h3>
          <p className="text-gray-400">@{profile.username || "username"}</p>
        </div>
      </div>

      <div className="space-y-4 rounded-lg px-4">
        <div>
          <p className="text-sm text-gray-400">Bio</p>
          <p className="mt-1">{profile.bio || "No bio set"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Email</p>
          <p className="mt-1">{profile.email || "No email set"}</p>
        </div>

        {/* <div className="grid grid-cols-2 gap-4"> */}
        <div>
          <p className="text-sm text-gray-400">Role</p>
          <p className="capitalize mt-1">{profile.role || "No role set"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Member since</p>
          <p className="mt-1">
            {profile.createdAt
              ? new Date(profile.createdAt).toLocaleDateString()
              : "Unknown"}
          </p>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
