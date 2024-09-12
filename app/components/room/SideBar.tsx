import {
  IconFiles,
  IconMessage,
  IconMessages,
  IconSettings,
  IconSettings2,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

const SideBar = () => {
  return (
    <div className="flex flex-col space-y-4 px-4">
      <Link href={"files"} className="mt-4">
        <IconFiles className="opacity-70 hover:opacity-100 hover:text-purple-400" />
      </Link>
      <Link href={"people"}>
        <IconUsers className="opacity-70 hover:opacity-100 hover:text-purple-400" />
      </Link>
      <Link href={"chat"}>
        <IconMessages className="opacity-70 hover:opacity-100 hover:text-purple-400" />
      </Link>
      <Link href={"video"}>
        <IconVideo className="opacity-70 hover:opacity-100 hover:text-purple-400" />
      </Link>
      <Link href={"settings"}>
        <IconSettings2 className="opacity-70 hover:opacity-100 hover:text-purple-400" />
      </Link>
    </div>
  );
};

export default SideBar;
