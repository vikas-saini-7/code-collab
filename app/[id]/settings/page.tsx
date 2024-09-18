"use client";
import React, { useState } from "react";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  changeFontSize,
  changeLanguage,
} from "@/redux/reducers/settingsReducer";
import Link from "next/link";

type LangsType = typeof langs;

const page: React.FC = () => {
  const dispatch = useAppDispatch();

  // store
  const fontSize = useAppSelector((item) => item.settings.fontSize);
  const language = useAppSelector((item) => item.settings.language);
  const theme = useAppSelector((item) => item.settings.theme);
  const username = useAppSelector((item) => item.user.username);
  const roomId = useAppSelector((item) => item.room.roomId);

  // handlers
  const handleFontSizeChange = (size: number) => {
    dispatch(changeFontSize(size));
  };

  const handleSave = () => {};

  return (
    <div className="p-4 space-y-4">
      {/* language  */}
      <div className="">
        <h2>language: </h2>
        <select
          className="p-1 text-black w-full"
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

      {/* font size  */}
      <div className="mb-4">
        <h2>font size: </h2>
        <input
          onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
          defaultValue={fontSize}
          className="w-full h-8 px-3 text-black"
          type="text"
        />
      </div>

      {/* theme: coming soon  */}
      {/* <div className="">
        <h2>Theme: </h2>
        <select
          className="p-1 text-black w-full"
          value={theme}
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
      </div> */}

      {/* save button  */}
      <button
        onClick={handleSave}
        className="w-full h-9 rounded bg-purple-400 hover:bg-purple-500 font-bold text-md text-black"
      >
        Save & Exit
      </button>

      <div>
        <p>Name: {username}</p>
        <p>Room: {roomId}</p>
      </div>
    </div>
  );
};

export default page;
