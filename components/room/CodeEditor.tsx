"use client";
import React, { useState, useRef, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { changeCode } from "@/redux/reducers/filesReducer";
import socket from "@/utils/socket";
import Tooltip from "./Tooltip";
import { usePathname } from "next/navigation";
import VideoContainer from "./VideoContainer";

const CodeEditor: React.FC = () => {
  // return video container component if path is video
  const pathname = usePathname();
  const endPart = pathname.split("/").pop();
  if (endPart === "video") return <VideoContainer />;

  // Main Component logic goes here
  const dispatch = useAppDispatch();

  // store
  const username = useAppSelector((item) => item.user.username);
  const activeFile = useAppSelector((item) => item.files.activeFile);
  const roomId = useAppSelector((item) => item.room.roomId);

  const fontSize = useAppSelector((item) => item.settings.fontSize);
  const language = useAppSelector((item) => item.settings.language);

  const [tooltip, setTooltip] = useState<{
    text: string;
    position: { x: number; y: number } | null;
  }>({
    text: "",
    position: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCodeChange = React.useCallback(
    (val: string, viewUpdate: any) => {
      dispatch(changeCode(val));

      socket.emit("changeCode", {
        fileId: activeFile.id,
        code: val,
        username: username,
        roomId: roomId,
      });

      // getting data fro tooltip
      const cursor = viewUpdate.state.selection.main.head;
      const line = viewUpdate.state.doc.lineAt(cursor);
      const cursorX = cursor - line.from;
      const cursorY = viewUpdate.view.coordsAtPos(cursor).bottom;

      socket.emit("showTooltip", {
        text: username,
        position: { x: cursorX * 10, y: cursorY },
        roomId: roomId,
      });
    },
    [activeFile, username, roomId, dispatch]
  );

  // tooltip for code updation
  useEffect(() => {
    socket.on("showTooltip", (data: any) => {
      setTooltip({
        text: data.text,
        position: data.position,
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setTooltip({
          text: "",
          position: null,
        });
      }, 500);
    });

    return () => {
      socket.off("showTooltip");
    };
  }, []);

  return (
    <div className="text-gray-900 h-screen" style={{ position: "relative" }}>
      <CodeMirror
        className={`h-full`}
        value={activeFile.value}
        height="100%"
        extensions={[langs[language]()]}
        onChange={handleCodeChange}
        theme={dracula}
        style={{ fontSize: `${fontSize}px` }}
      />
      {tooltip.position && tooltip.text !== "" && (
        <Tooltip text={tooltip.text} position={tooltip.position} />
      )}
    </div>
  );
};

export default CodeEditor;
