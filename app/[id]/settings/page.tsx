"use client";
import React, { useState } from "react";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  changeFontSize,
  changeLanguage,
} from "@/redux/reducers/settingsReducer";

type LangsType = typeof langs;

const page: React.FC = () => {
  const dispatch = useAppDispatch();
  const fontSize = useAppSelector((item) => item.settings.fontSize);
  const language = useAppSelector((item) => item.settings.language);

  const handleFontSizeChange = (size: number) => {
    dispatch(changeFontSize(size));
  };

  const handleSave = () => {};

  return (
    <div className="p-4 space-y-4">
      <div className="">
        <h2>language: </h2>
        <select
          className="p-1 text-black"
          value={language}
          onChange={(e) =>
            dispatch(changeLanguage(e.target.value as keyof LangsType))
          }
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
          onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
          defaultValue={fontSize}
          className="w-full h-8 px-3 text-black"
          type="text"
        />
      </div>
      <button
        onClick={handleSave}
        className="w-full h-9 rounded bg-purple-400 hover:bg-purple-500 font-bold text-lg text-black"
      >
        Save
      </button>
    </div>
  );
};

export default page;
