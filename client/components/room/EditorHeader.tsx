import { useRoomContext } from "@/providers/roomContextProvider";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import React from "react";

const EditorHeader = () => {
  const { activeFile, updateFileContent, saveStatus } = useRoomContext();
  return (
    <div className="flex items-center gap-2 border-b border-[#1a1a1a] bg-[#17171] px-4 py-2">
      {/* display file name  only  */}
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-bold text-gray-200">
          <span className="text-[#00E87B]">$/</span>{" "}
          {activeFile ? activeFile.fileName : "Untitled"}
        </h1>
      </div>

      {/* STATUS  */}
      <div
        className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all duration-300`}
        style={{
          backgroundColor: "rgba(26, 26, 26, 0.8)",
          backdropFilter: "blur(4px)",
          border: `1px solid ${
            saveStatus === "saved" ? "#00E87B" : "transparent"
          }`,
        }}
      >
        {saveStatus === "saving" ? (
          <>
            <IconLoader2 size={16} className="animate-spin" color="#e2e8f0" />
            <span className="text-xs text-gray-200">Saving</span>
          </>
        ) : saveStatus === "saved" ? (
          <>
            <IconCheck size={16} color="#00E87B" />
            <span className="text-xs text-gray-200">Saved on Cloud</span>
          </>
        ) : (
          <>
            <IconCheck size={16} color="#00E87B" />
            <span className="text-xs text-gray-200">Saved on Cloud</span>
          </>
        )}
      </div>
    </div>
  );
};

export default EditorHeader;
