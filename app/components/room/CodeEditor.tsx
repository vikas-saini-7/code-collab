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
    </div>
  );
};

export default CodeEditor;
