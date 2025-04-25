"use client";
import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { usePathname } from "next/navigation";
import VideoContainer from "./VideoContainer";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { useRoomContext } from "@/providers/roomContextProvider";
import { useAppSelector } from "@/redux/store";
import { IconCheck, IconRefresh, IconLoader2 } from "@tabler/icons-react";
import { langs } from "@uiw/codemirror-extensions-langs";

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

const getLanguageExtension = (fileLanguage: string) => {
  // Check if the language exists in the langs object
  if (fileLanguage in langs) {
    return langs[fileLanguage as keyof typeof langs];
  }
  // Return javascript as fallback
  return langs.javascript;
};

const CodeEditor: React.FC = () => {
  // return video container component if path is video
  const pathname = usePathname();
  const endPart = pathname.split("/").pop();
  if (endPart === "video") return <VideoContainer />;

  const { activeFile, updateFileContent, saveStatus } = useRoomContext();
  const fontSize = useAppSelector((item) => item.settings.fontSize);

  // Track local content state to prevent unnecessary updates
  const [localContent, setLocalContent] = useState<string>(
    activeFile?.content || ""
  );

  // Update local content when active file changes
  useEffect(() => {
    if (activeFile?.content !== undefined) {
      setLocalContent(activeFile.content);
    }
  }, [activeFile?._id, activeFile?.content]);

  const handleCodeChange = (value: string) => {
    if (!activeFile) return;

    // Update local state immediately for responsive editing
    setLocalContent(value);

    // Trigger the debounced update function from context
    updateFileContent(activeFile._id, value, activeFile.roomId);
  };

  const fileLanguage = activeFile?.language || "javascript";

  return (
    <div className="text-gray-900 h-screen" style={{ position: "relative" }}>
      <div
        className={`absolute top-2 right-4 z-10 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all duration-300`}
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
            <span className="text-xs text-gray-200">Saved</span>
          </>
        ) : (
          <>
            <IconCheck size={16} color="#00E87B" />
            <span className="text-xs text-gray-200">Ready</span>
          </>
        )}
      </div>

      <CodeMirror
        className={`h-full`}
        value={localContent}
        height="100%"
        extensions={[getLanguageExtension(fileLanguage)()]}
        onChange={handleCodeChange}
        theme={blackTheme}
        style={{
          fontSize: `${fontSize}px`,
        }}
      />
    </div>
  );
};

export default CodeEditor;
