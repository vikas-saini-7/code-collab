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
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

const blackTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#111111",
    foreground: "#e0e0e0",
    caret: "#4f9eff",
    selection: "#2a2a2a",
    selectionMatch: "#2a2a2a",
    lineHighlight: "#1a1a1a",
    gutterBackground: "#111111",
    gutterForeground: "#666666",
    gutterBorder: "#1a1a1a",
    // activeLine: "#1f1f1f",
    // activeLineGutter: "#1f1f1f",
    // matchingBracket: "#3d3d3d",
    // highlightActiveLineGutter: true,
  },
  styles: [
    // Basic syntax
    { tag: [t.comment], color: "#666666", fontStyle: "italic" },
    { tag: [t.lineComment], color: "#666666", fontStyle: "italic" },
    { tag: [t.blockComment], color: "#666666", fontStyle: "italic" },
    { tag: [t.docComment], color: "#7a8a8d", fontStyle: "italic" },

    // Variables and identifiers
    { tag: [t.variableName], color: "#4f9eff" },
    { tag: [t.definition(t.variableName)], color: "#c78aff" },
    { tag: [t.local(t.variableName)], color: "#59a6ff" },

    // Functions
    { tag: [t.function(t.variableName)], color: "#4f9eff", fontWeight: "bold" },
    {
      tag: [t.definition(t.function(t.variableName))],
      color: "#4f9eff",
      fontWeight: "bold",
    },
    // { tag: [t.functionKeyword], color: "#ff6b9f" },

    // Classes and types
    { tag: [t.className], color: "#54c8ff", fontWeight: "bold" },
    { tag: [t.typeName], color: "#54c8ff" },
    { tag: [t.typeOperator], color: "#ff6b9f" },
    { tag: [t.propertyName], color: "#4f9eff" },

    // Keywords and control flow
    { tag: [t.keyword], color: "#ff6b9f", fontWeight: "bold" },
    { tag: [t.controlKeyword], color: "#ff6b9f", fontWeight: "bold" },
    { tag: [t.moduleKeyword], color: "#ff6b9f" },

    // Literals
    { tag: [t.string], color: "#6dd390" },
    { tag: [t.number], color: "#ff9447" },
    { tag: [t.bool], color: "#ff9447" },
    { tag: [t.null], color: "#ff9447" },
    { tag: [t.regexp], color: "#ff7e57" },

    // Operators and syntax
    { tag: [t.operator], color: "#54c8ff" },
    { tag: [t.bracket], color: "#666666" },
    { tag: [t.punctuation], color: "#666666" },
    { tag: [t.derefOperator], color: "#54c8ff" },

    // Special syntax
    { tag: [t.meta], color: "#848484" },
    { tag: [t.tagName], color: "#ff6b9f" },
    { tag: [t.attributeName], color: "#4f9eff" },
    { tag: [t.attributeValue], color: "#6dd390" },

    // Markdown specific
    { tag: [t.heading], color: "#ff6b9f", fontWeight: "bold" },
    { tag: [t.quote], color: "#6dd390", fontStyle: "italic" },
    { tag: [t.link], color: "#4f9eff", textDecoration: "underline" },

    // Invalid code
    { tag: [t.invalid], color: "#ff5555" },
  ],
});

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
        theme={blackTheme}
        style={{
          fontSize: `${fontSize}px`,
        }}
      />
      {tooltip.position && tooltip.text !== "" && (
        <Tooltip text={tooltip.text} position={tooltip.position} />
      )}
    </div>
  );
};

export default CodeEditor;
