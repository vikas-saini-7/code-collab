"use client";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { changeCode } from "@/redux/reducers/filesReducer";

const CodeEditor: React.FC = () => {
  const dipatch = useAppDispatch();
  const activeFileValue = useAppSelector((item) => item.files.activeFile.value);

  const fontSize = useAppSelector((item) => item.settings.fontSize);
  const language = useAppSelector((item) => item.settings.language);

  const onChange = React.useCallback((val: string, viewUpdate: any) => {
    console.log("val:", val);
    dipatch(changeCode(val));
  }, []);

  return (
    <div className="text-gray-900 h-screen">
      <CodeMirror
        className={`h-full`}
        value={activeFileValue}
        height="100%"
        extensions={[langs[language]()]}
        onChange={onChange}
        theme={dracula}
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
};

export default CodeEditor;
