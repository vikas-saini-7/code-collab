"use client";
import { changeActiveFile, saveFile } from "@/redux/reducers/filesReducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import React from "react";

const page: React.FC = () => {
  const dispatch = useAppDispatch();

  const filesList = useAppSelector((item) => item.files.filesList);
  const handleFileSave = () => {
    dispatch(saveFile(1));
  };

  const handleActiveFileChange = (file: any) => {
    dispatch(changeActiveFile(file));
  };

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      <div>
        {/* top actions */}
        <div className="border-b border-white/10 mb-2 px-2 py-2 flex gap-1 items-center justify-between text-xs">
          <p>Files</p>
          <div className="cursor-pointer">
            <IconPlus size={16} />
          </div>
        </div>

        {/* files list  */}
        <div>
          {filesList.map((file) => (
            <div
              onClick={() => handleActiveFileChange(file)}
              className="bg-gray-500/5 mb-1 rounded px-2 py-1 flex gap-1 items-center justify-between text-sm cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <p>{file.icon}</p>
                <p>
                  {file.name}.{file.extension}
                </p>
              </div>
              <div className="hover:text-red-500">
                <IconTrash size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* bottom actions  */}
      <div>
        <button
          onClick={handleFileSave}
          className={`w-full h-9 rounded bg-purple-400 hover:bg-purple-500 font-bold text-md text-black`}
        >
          Save File
        </button>
      </div>
    </div>
  );
};

export default page;
