"use client";
import React from "react";
import { langs } from "@uiw/codemirror-extensions-langs";

type LangsType = typeof langs;

const page: React.FC = () => {
  const [language, setLanguage] = React.useState<keyof LangsType>("javascript");
  return (
    <div className="p-4 space-y-4">
      <div className="">
        <h2>language: </h2>
        <select
          className="p-1 text-black w-full"
          value={language}
          onChange={(e) => setLanguage(e.target.value as keyof LangsType)}
        >
          {Object.keys(langs).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <h2>font size: </h2>
        <input
          defaultValue={12}
          className="w-full h-8 px-3 text-black"
          type="text"
        />
      </div>
      <button className="w-full h-9 rounded bg-purple-400 hover:bg-purple-500 font-bold text-lg text-black">
        Save
      </button>
    </div>
  );
};

export default page;
