import { useRoomContext } from "@/providers/roomContextProvider";
import {
  IconCheck,
  IconLoader2,
  IconCloud,
  IconCloudFilled,
} from "@tabler/icons-react";
import React from "react";

const EditorHeader = () => {
  const { activeFile, updateFileContent, saveStatus } = useRoomContext();
  return (
    <div className="flex items-center justify-between gap-2 border-b border-[#1a1a1a] bg-[#17171] px-4 py-2">
      {/* display file name  only  */}
      <div className="flex items-center justify-between">
        <h1 className="text-sm text-gray-200">
          <span className="text-[#00E87B]">/</span>{" "}
          {activeFile ? activeFile.fileName : "Untitled"}
        </h1>
      </div>

      {/* STATUS ICON */}
      <div className="flex items-center gap-1.5">
        <div
          className={`p-1.5 rounded-full flex items-center justify-center transition-all duration-300 ${
            saveStatus === "saved"
              ? "bg-[#00E87B]/10"
              : saveStatus === "saving"
              ? "bg-gray-700/30"
              : "bg-[#ff6b6b]/10"
          }`}
        >
          {saveStatus === "saving" ? (
            <div className="relative">
              <IconCloudFilled size={16} className="text-gray-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-ping opacity-75"></div>
              </div>
            </div>
          ) : saveStatus === "saved" ? (
            <div className="relative">
              <IconCloudFilled size={16} className="text-[#00E87B]" />
            </div>
          ) : (
            <div className="relative">
              <IconCloudFilled size={16} className="text-[#ff6b6b]" />
            </div>
          )}
        </div>

        <span
          className={`text-xs font-medium ${
            saveStatus === "saved"
              ? "text-[#00E87B]"
              : saveStatus === "saving"
              ? "text-gray-400"
              : "text-[#ff6b6b]"
          }`}
        >
          {saveStatus === "saving"
            ? "Saving..."
            : saveStatus === "saved"
            ? "Saved"
            : "Unsaved"}
        </span>
      </div>
    </div>
  );
};

export default EditorHeader;
