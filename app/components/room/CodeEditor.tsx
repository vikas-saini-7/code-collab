"use client";
import React, { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useAppSelector } from "@/redux/store";

const CodeEditor: React.FC = () => {
  const fontSize = useAppSelector((item) => item.settings.fontSize);
  const language = useAppSelector((item) => item.settings.language);

  const [value, setValue] = React.useState<string>(
    "console.log('hello world!');"
  );

  const onChange = React.useCallback((val: string, viewUpdate: any) => {
    console.log("val:", val);
    setValue(val);
  }, []);

  const saveFile = () => {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "code.txt";
    link.click();
  };

  return (
    <div className="text-gray-900 h-screen">
      <CodeMirror
        className={`h-full`}
        value={value}
        height="100%"
        extensions={[langs[language]()]}
        onChange={onChange}
        theme={dracula}
        style={{ fontSize: `${fontSize}px` }}
      />
      <button
        onClick={saveFile}
        className="mt-2 p-2 bg-purple-400 hover:bg-purple-500 text-white rounded"
      >
        Save
      </button>
    </div>
  );
};

export default CodeEditor;
