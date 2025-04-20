"use client";
import React from "react";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  changeFontSize,
  changeLanguage,
} from "@/redux/reducers/settingsReducer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LangsType = typeof langs;

const page: React.FC = () => {
  const dispatch = useAppDispatch();

  const fontSize = useAppSelector((item) => item.settings.fontSize);
  const language = useAppSelector((item) => item.settings.language);
  const theme = useAppSelector((item) => item.settings.theme);
  const username = useAppSelector((item) => item.user.username);
  const roomId = useAppSelector((item) => item.room.roomId);

  const handleFontSizeChange = (size: number) => {
    dispatch(changeFontSize(size));
  };

  const handleSave = () => {};

  return (
    <div className="container mx-auto max-w-md p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Editor Settings</h1>

      <div className="space-y-2">
        <label className="text-sm font-medium">Language</label>
        <Select
          value={language}
          onValueChange={(value) =>
            dispatch(changeLanguage(value as keyof LangsType))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(langs).map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Font Size</label>
        <Input
          type="number"
          value={fontSize}
          onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
          className="w-full"
          min={8}
          max={32}
        />
      </div>

      <Button
        onClick={handleSave}
        className="w-full bg-[#00E87B] hover:bg-[#00E87B]/90 font-bold mt-4"
      >
        Save & Exit
      </Button>
    </div>
  );
};

export default page;