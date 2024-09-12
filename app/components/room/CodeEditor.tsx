"use client";
import React, { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import {
  langs,
  loadLanguage,
  langNames,
} from "@uiw/codemirror-extensions-langs";

type LangsType = typeof langs;

const CodeEditor: React.FC = () => {
  const [value, setValue] = React.useState<string>(
    "console.log('hello world!');"
  );
  const [language, setLanguage] = React.useState<keyof LangsType>("javascript");

  const onChange = React.useCallback((val: string, viewUpdate: any) => {
    console.log("val:", val);
    setValue(val);
  }, []);

  const loadLanguageExtension = async (lang: keyof LangsType) => {
    try {
      await loadLanguage(lang);
      console.log(`Loaded language: ${lang}`);
    } catch (error) {
      console.error(`Failed to load language: ${lang}`, error);
    }
  };

  useEffect(() => {
    loadLanguage("tsx");
    langs.tsx();
    console.log("langNames:", langNames);
  }, []);

  useEffect(() => {
    loadLanguageExtension(language);
  }, [language]);

  return (
    <div className="text-gray-900 h-screen">
      {/* <select
        className="p-1"
        value={language}
        onChange={(e) => setLanguage(e.target.value as keyof LangsType)}
      >
        {Object.keys(langs).map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select> */}
      <CodeMirror
        className="h-full text-md"
        value={value}
        height="100%"
        extensions={[langs[language]()]}
        onChange={onChange}
        theme={dracula}
      />
    </div>
  );
};

export default CodeEditor;
