"use client";
import React, { useRef, useState, useEffect } from "react";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  changeActiveFile,
  createFile,
  fileDelete,
  saveFile,
} from "@/redux/reducers/filesReducer";

const page: React.FC = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  // store
  const filesList = useAppSelector((item) => item.files.filesList);
  const activeFile = useAppSelector((item) => item.files.activeFile);

  // local
  const [createFileVisible, setCreateFileVisible] = useState<Boolean>(false);

  // actions
  const handleFileSave = () => {
    dispatch(saveFile(1));
  };

  const handleActiveFileChange = (file: any) => {
    // console.log("Changing file: ", file);
    dispatch(changeActiveFile(file));
  };

  const handleCreateFile = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const input = event.target as HTMLInputElement;
      dispatch(createFile(input.value));
      setCreateFileVisible(false);
    }
  };

  const handleFileDelete = (file: any) => {
    dispatch(fileDelete(file));
  };

  useEffect(() => {
    if (createFileVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [createFileVisible]);

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      <div>
        {/* top actions */}
        <div className="border-b border-white/10 mb-2 px-2 py-2 flex gap-1 items-center justify-between text-xs">
          <p>Files</p>
          <div
            className="cursor-pointer"
            onClick={() => setCreateFileVisible(!createFileVisible)}
          >
            <IconPlus
              className={`${createFileVisible && "rotate-45"}`}
              size={16}
            />
          </div>
        </div>

        {/* files list  */}
        <div>
          {filesList.map((file) => (
            <div
              key={file.id}
              onClick={() => handleActiveFileChange(file)}
              className={`${
                file.id === activeFile.id &&
                "bg-gray-500/10 hover:bg-gray-500/10"
              } hover:bg-gray-500/10 mb-1 rounded px-2 py-1 flex gap-1 items-center justify-between text-sm cursor-pointer `}
            >
              <div className="flex items-center gap-1">
                <p>{file.icon}</p>
                <p>
                  {file.name}.{file.extension}
                </p>
              </div>
              <div
                onClick={() => {
                  handleFileDelete(file);
                }}
                className="hover:text-red-500"
              >
                <IconTrash size={14} />
              </div>
            </div>
          ))}

          {/* create file container  */}
          {createFileVisible && (
            <div
              className={`bg-gray-500/5 border-gray-500/10 rounded px-2 py-1 flex gap-1 items-center justify-between text-sm`}
            >
              <p>📄</p>
              <input
                ref={inputRef}
                className="bg-transparent w-full px-[1px] outline-none"
                type="text"
                onKeyDown={handleCreateFile}
              />
              <p
                className="cursor-pointer"
                onClick={() => setCreateFileVisible(!createFileVisible)}
              >
                <IconX size={14} />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* bottom actions  */}
      <div>
        <button
          onClick={handleFileSave}
          className={`w-full mb-2 h-9 rounded bg-purple-400 hover:bg-purple-500 font-bold text-md text-black`}
        >
          Save File
        </button>
      </div>
    </div>
  );
};

export default page;
