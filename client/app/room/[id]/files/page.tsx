"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  IconPlus,
  IconTrash,
  IconX,
  IconBrandJavascript,
  IconBrandTypescript,
  IconBrandHtml5,
  IconBrandCss3,
  IconFileText,
  IconBrandPython,
  IconCode,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useRoomContext } from "@/providers/roomContextProvider";
import { toast } from "sonner";
import axios from "axios";

const Page: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { roomData, setRoomData, activeFile, setActiveFile } = useRoomContext();

  // Local state (replacing Redux)
  const [filesList, setFilesList] = useState<any[]>([]);
  const [createFileVisible, setCreateFileVisible] = useState<boolean>(false);

  // Initialize filesList from roomData
  useEffect(() => {
    if (roomData?.files) {
      setFilesList(roomData.files);
      // Set first file as active by default if available
      if (roomData.files.length > 0 && !activeFile) {
        setActiveFile(roomData.files[0]);
      }
    }
  }, [roomData]);

  // Function to get file icon based on extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "js":
      case "jsx":
        return <IconBrandJavascript size={16} className="text-yellow-400" />;
      case "ts":
      case "tsx":
        return <IconBrandTypescript size={16} className="text-blue-400" />;
      case "html":
        return <IconBrandHtml5 size={16} className="text-orange-500" />;
      case "css":
        return <IconBrandCss3 size={16} className="text-blue-500" />;
      case "py":
        return <IconBrandPython size={16} className="text-green-500" />;
      default:
        return <IconFileText size={16} className="text-gray-400" />;
    }
  };

  // Actions
  const handleFileSave = async () => {
    try {
      // Implement your save file logic here
      toast.success("File saved successfully!");
    } catch (error) {
      console.error("Error saving file:", error);
      toast.error("Failed to save file");
    }
  };

  const handleActiveFileChange = (file: any) => {
    setActiveFile(file);
  };

  const handleCreateFile = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && inputRef.current?.value) {
      try {
        const fullFileName = inputRef.current.value;
        const lastDotIndex = fullFileName.lastIndexOf(".");

        let fileName, extension;
        if (lastDotIndex === -1) {
          // No extension provided, default to txt
          fileName = fullFileName;
          extension = "txt";
        } else {
          fileName = fullFileName.substring(0, lastDotIndex);
          extension = fullFileName.substring(lastDotIndex + 1);
        }

        // Determine language based on extension
        let language = "";
        switch (extension.toLowerCase()) {
          case "js":
            language = "javascript";
            break;
          case "jsx":
            language = "javascript";
            break;
          case "ts":
            language = "typescript";
            break;
          case "tsx":
            language = "typescript";
            break;
          case "html":
            language = "html";
            break;
          case "css":
            language = "css";
            break;
          case "py":
            language = "python";
            break;
          default:
            language = "plaintext";
        }

        // Create fullFileName that includes the extension
        const fileNameWithExtension =
          lastDotIndex === -1 ? `${fileName}.${extension}` : fullFileName;

        const fileExists = filesList.some(
          (file) => file.fileName === fileNameWithExtension
        );
        if (fileExists) {
          toast.error(`File "${fileNameWithExtension}" already exists`);
          return;
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/file`,
          {
            roomId: roomData?._id,
            fileName: fileNameWithExtension,
            language,
            extension,
            content: "",
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          // Add the new file to state and update roomData
          const newFile = response.data.data;
          const updatedFiles = [...filesList, newFile];
          setFilesList(updatedFiles);
          setActiveFile(newFile);

          // Update roomData if it exists
          if (roomData) {
            setRoomData({
              ...roomData,
              files: updatedFiles,
            });
          }

          setCreateFileVisible(false);
          inputRef.current.value = "";
          toast.success("File created successfully!");
        } else {
          toast.error(response.data.message || "Failed to create file");
        }
      } catch (err) {
        toast.error("Error creating file");
      }
    }
  };

  const handleFileDelete = async (file: any) => {
    try {
      // Make PUT request to delete the file
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/file/delete`,
        {
          roomId: roomData?._id,
          fileId: file._id,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update local state and roomData
        const updatedFiles = filesList.filter((f) => f._id !== file._id);
        setFilesList(updatedFiles);

        // If the active file was deleted, set a new active file
        if (activeFile?._id === file._id) {
          setActiveFile(updatedFiles.length > 0 ? updatedFiles[0] : null);
        }

        // Update roomData if it exists
        if (roomData) {
          setRoomData({
            ...roomData,
            files: updatedFiles,
          });
        }

        toast.success("File deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete file");
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      toast.error("Error deleting file");
    }
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
              className={`${createFileVisible ? "rotate-45" : ""}`}
              size={16}
            />
          </div>
        </div>

        {/* files list  */}
        <div>
          {filesList.map((file) => (
            <div
              key={file._id}
              onClick={() => handleActiveFileChange(file)}
              className={`${
                activeFile?._id === file._id &&
                "bg-gray-500/10 hover:bg-gray-500/10"
              } hover:bg-gray-500/10 mb-1 rounded px-2 py-1 flex gap-1 items-center justify-between text-sm cursor-pointer `}
            >
              <div className="flex items-center gap-2">
                {getFileIcon(file.fileName)}
                <p>{file.fileName}</p>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
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
              <IconCode size={16} className="text-gray-400" />
              <input
                ref={inputRef}
                className="bg-transparent w-full px-[1px] outline-none"
                type="text"
                onKeyDown={handleCreateFile}
              />
              <p
                className="cursor-pointer"
                onClick={() => setCreateFileVisible(false)}
              >
                <IconX size={14} />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* bottom actions  */}
      <div>
        <Button
          onClick={handleFileSave}
          className={`bg-[#00E87B] w-full font-bold`}
          disabled={!activeFile}
        >
          Save File
        </Button>
      </div>
    </div>
  );
};

export default Page;
