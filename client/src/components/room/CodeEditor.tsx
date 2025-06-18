"use client";

import React, { useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { javascript } from "@codemirror/lang-javascript";

export default function CodeEditor({
  code,
  onChange,
}: {
  code: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <CodeMirror
        value={code}
        height="100%"
        theme={oneDark}
        extensions={[javascript()]}
        onChange={(value) => onChange(value)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
        }}
        style={{
          height: "100%",
        }}
      />
    </div>
  );
}
