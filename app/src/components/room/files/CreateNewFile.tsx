import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFileIcon } from "@/lib/getFileIcon";
import { IconX } from "@tabler/icons-react";
import React, { useEffect, useRef } from "react";
import { IFile } from "@/types/types";
import { saveFile } from "@/services/file-services";
import { useParams } from "next/navigation";
import { getLanguageNameFromFileName } from "@/lib/getLanguageName";

interface CreateNewFileProps {
  onClose: () => void;
  onFileCreate: (newFile: IFile) => void;
}

const CreateNewFile: React.FC<CreateNewFileProps> = ({
  onClose,
  onFileCreate,
}) => {
  const { roomId } = useParams();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCreateFile = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const fileName = inputRef.current?.value.trim();
      if (fileName) {
        console.log("New file created:", fileName);
        // Here you would typically call an API to create the file
        const newFile = {
          _id: "", // This will be set by the server
          name: fileName,
          content: "",
          language: getLanguageNameFromFileName(fileName),
        };

        const res = await saveFile(newFile, roomId as string);
        if (res.status === 201) {
          onFileCreate(res.data);
        }
      }
    }
  };

  return (
    <div className="p-2 flex items-center">
      <div className="flex items-center gap-2 w-full">
        {getFileIcon("new")}
        <Input
          ref={inputRef}
          onKeyDown={handleCreateFile}
          placeholder="Enter file name"
          className="h-6 border-none p-0 bg-transparent !bg-none shadow-none focus:shadow-none focus:bg-transparent focus:border-none focus-visible:bg-transparent focus-visible:border-none hover:bg-transparent !ring-0 !ring-offset-0"
          style={{
            background: "transparent",
            backgroundColor: "transparent",
          }}
        />
      </div>
      <div
        onClick={onClose}
        className="cursor-pointer hover:bg-white/10 rounded p-1"
      >
        <IconX size={16} className="text-gray-500" />
      </div>
    </div>
  );
};

export default CreateNewFile;
